// ------------------------------------------------------------------------
// DataSaverReasoning.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

//The script is based on the firebase Unity documentation: https://firebase.google.com/docs/unity/setup

using System;
using UnityEngine;
using System.Runtime.InteropServices;

/*
 * This class is used for storing the data which is then sent to the database.
 */
[Serializable]
public class DataToSaveReasoning
{
    public string playerId;
    public int desiredAmount;
    public int level;
    public int finalAmount;
    public int desiredFinalDelta;
    public string date;
    public int overshotCoefficient;
    public string GameType = "Reasoning";
}
public class DataSaverReasoning : MonoBehaviour 
{
    private DataToSaveReasoning _dataToSaveReasoning = new DataToSaveReasoning();

    [DllImport("__Internal")]
    private static extern void SendMessageToWebView(string message);

    private void Awake() {
        ResetData();
    }

    private void OnEnable()
    {
        LogStatisticsEvents.sendPlayerStatisticsReasoning += SaveData;
    }

    private void OnDisable()
    {
        LogStatisticsEvents.sendPlayerStatisticsReasoning -= SaveData;
    }
    
    /*
     * This method is called when the event is triggered. It saves the data to the database.
     */
    private void SaveData(DataToSaveReasoning data)
    {
        _dataToSaveReasoning = data;
        _dataToSaveReasoning.playerId = "1";
        _dataToSaveReasoning.date = DateTime.Now.ToString("O");
        string json = JsonUtility.ToJson(_dataToSaveReasoning);
        SendMessageToWebView(json);
        
        ResetData();
    }

    private void ResetData()
    {
        _dataToSaveReasoning.desiredAmount = 0;
        _dataToSaveReasoning.level = 0;
        _dataToSaveReasoning.finalAmount = 0;
        _dataToSaveReasoning.desiredFinalDelta = 0;
        _dataToSaveReasoning.date = "";
        _dataToSaveReasoning.overshotCoefficient = 0;
    }
}
