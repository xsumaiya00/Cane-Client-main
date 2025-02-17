package com.jbkdfkl.caneclient

import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.util.Log
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.asFlow

import mylibrary.mindrove.SensorData
import mylibrary.mindrove.ServerManager
import mylibrary.mindrove.Instruction
import mylibrary.mindrove.ServerThread
import kotlinx.coroutines.*
import com.google.gson.Gson
import java.util.concurrent.TimeUnit

import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule

enum class EEGEvent(val eventName: String) {
    DATA("onEEGData"),
    ERROR("onEEGError")
}

class EEGBuffer(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val sensorDataText = MutableLiveData("No data yet")
    private val networkStatus = MutableLiveData("Checking network status...")

    private val sensorDataBuffer = mutableListOf<DoubleArray>()

    private lateinit var handler: Handler
    private lateinit var runnable: Runnable

    private var isServerManagerStarted = false
    private var isWifiSettingsOpen = false
    private var hasScheduledDataSending = false

    private var listenerCount = 0


    override fun getName() = "EEGBuffer"


    private val serverManager = ServerManager { sensorData: SensorData ->
        val channelValues = doubleArrayOf(
            sensorData.channel1,
            sensorData.channel2,
            sensorData.channel3,
            sensorData.channel4,
            sensorData.channel5,
            sensorData.channel6,
            sensorData.channel7,
            sensorData.channel8
        )

        synchronized(sensorDataBuffer) {
            Log.d("EEGBuffer", "Data added to buffer: ${channelValues.joinToString(", ")}")
            sensorDataBuffer.add(channelValues)
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.accelerationX}")
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.angularRateX}")
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.voltage}")
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.trigger}")
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.numberOfMeasurement}")
            Log.d("EEGBuffer", "Data added to buffer: ${sensorData.impedance1ToDRL}")

        }

        sensorDataText.postValue(channelValues.joinToString(", "))
    }

    private fun startServer() {
        try {
            if (isServerManagerStarted) {
                Log.d("EEGBuffer", "Server already started.")
                return
            }

            try {
                Log.d("EEGBuffer", "Attempting to start server.")
                serverManager.start()
                Log.d("EEGBuffer", "Server started successfully.")
                isServerManagerStarted = true
                Log.d("EEGBuffer", "Server started.")
            } catch (e: Exception) {
                Log.e("EEGBuffer", "Error inside serverManager.start(): ${e.message}", e)
                sendEvent(reactApplicationContext, EEGEvent.ERROR, "There was an error performing the scan, if this is persistent, please restart the application")
            }
        } catch (e: Exception) {
            Log.e("EEGBuffer", "Error starting server: ${e.message}")
            e.printStackTrace()
        }
    }

    @ReactMethod
    fun stopServer() {
        if (::handler.isInitialized) {
            handler.removeCallbacks(runnable) 
        }
        hasScheduledDataSending = false
        serverManager.stop()
        isServerManagerStarted = false
        Log.d("EEGBuffer", "Server and thread stopped")
    }


    fun sendEvent(reactContext: ReactContext, event: EEGEvent, params: String) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(event.eventName, params) 
    }

    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount++
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        listenerCount -= count
        if (listenerCount < 0) listenerCount = 0 
    }


    @ReactMethod
    fun startScan(dataSendDelay: Int) {
        try {
            Log.d("EEGBuffer", "startScan called with dataSendDelay: $dataSendDelay")

            if (::handler.isInitialized) {
                handler.removeCallbacks(runnable)
                Log.d("EEGBuffer", "Previous runnable cleared")
            }

            handler = Handler(Looper.getMainLooper())

            runnable = object : Runnable {
                override fun run() {
                    if (isNetworkAvailable()) {
                        Log.d("EEGBuffer", "Network available")

                        if (!isServerManagerStarted) {
                            Log.d("EEGBuffer", "Cuck")
                            startServer()
                            Log.d("EEGBuffer", "Server started")
                        }

                        if (!hasScheduledDataSending) {
                            sensorDataBuffer.clear() 
                            Log.d("EEGBuffer", "Buffer cleared")
                            handler.postDelayed({
                                val bufferedData = getBufferedData()
                                if (bufferedData != null) {
                                    Log.d("EEGBuffer", "Sending buffered data: $bufferedData")
                                    sendEvent(reactApplicationContext, EEGEvent.DATA, bufferedData)
                                } else {
                                    Log.d("EEGBuffer", "No data to send")
                                    sendEvent(reactApplicationContext, EEGEvent.ERROR, "EEG Scan is empty, are you sure the tablet is connected to the equipment through WiFi")
                                }
                            }, dataSendDelay.toLong())
                            hasScheduledDataSending = true
                        }
                    } else {
                        sendEvent(reactApplicationContext, EEGEvent.ERROR, "No Internet Connection Available")
                        Log.d("EEGBuffer", "No internet connection available")
                    }
                    handler.postDelayed(this, 3000)
                }
            }
            handler.post(runnable)
            Log.d("EEGBuffer", "Runnable started")

        } catch (e: Throwable) {
            sendEvent(reactApplicationContext, EEGEvent.ERROR, "EEG Scan Error: ${e.message}")
            Log.d("EEGBuffer", "Error during scan: ${e.message}")
        }
    }


    @ReactMethod
    fun abortScan() {
        if (::handler.isInitialized) {
            handler.removeCallbacks(runnable) 
        }

        hasScheduledDataSending = false
    }


    private fun getBufferedData() : String? {
        synchronized(sensorDataBuffer) {
            if (sensorDataBuffer.isNotEmpty()) {
                val gson = Gson()
                val jsonData = gson.toJson(sensorDataBuffer)
                return jsonData
            }
        }
        return null;
    }

    private fun isNetworkAvailable(): Boolean {
        val connectivityManager =
            reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

        val network = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        return capabilities != null &&
                (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                        capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR))
    }

}