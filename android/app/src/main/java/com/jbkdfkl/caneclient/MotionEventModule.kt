package com.jbkdfkl.caneclient

import android.app.Activity
import android.view.MotionEvent
import android.view.ViewGroup
import android.view.Window
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule

class MotionEventModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var windowCallback: Window.Callback? = null

    override fun getName(): String {
        return "MotionEventModule"
    }

    @ReactMethod
    fun startListening() {
        val activity = currentActivity

        if (activity != null && windowCallback == null) {
            val window = activity.window
            val originalCallback = window.callback
            windowCallback = object : Window.Callback by originalCallback {
                override fun dispatchTouchEvent(event: MotionEvent): Boolean {
                    val tiltRadians = event.getAxisValue(MotionEvent.AXIS_TILT).toDouble()
                    val altitude = Math.toDegrees(tiltRadians)

                    val orientationRadians = event.getAxisValue(MotionEvent.AXIS_ORIENTATION).toDouble()
                    val azimuth = (Math.toDegrees(orientationRadians) + 360) % 360

                    val map = Arguments.createMap().apply {
                        putInt("x", event.x.toInt())
                        putInt("y", event.y.toInt())
                        putInt("timestamp", event.eventTime.toInt())
                        putInt("status", if (event.action == MotionEvent.ACTION_DOWN || event.action == MotionEvent.ACTION_MOVE) 1 else 0)
                        putDouble("azimuth", azimuth)
                        putDouble("altitude", altitude)
                        putDouble("pressure", event.pressure.toDouble())
                    }

                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                        .emit("MotionEvent", map)

                    // Pass the event to the original callback
                    return originalCallback.dispatchTouchEvent(event)
                }
            }

            activity.runOnUiThread {
                window.callback = windowCallback
            }
        }
    }

    @ReactMethod
    fun stopListening() {
        val activity = currentActivity
        activity?.runOnUiThread {
            val window = activity.window
            if (windowCallback != null) {
                window.callback = (windowCallback as Window.Callback)
                windowCallback = null
            }
        }
    }

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for NativeEventEmitter but no-op
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Required for NativeEventEmitter but no-op
    }
}

