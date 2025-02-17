// ------------------------------------------------------------------------
// DataSaver.cs
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
public class DataToSave
{
    public string playerId;
    public float fastestReactionTimeSquares;
    public float fastestReactionTimeTriangles;
    public float fastestReactionTimeCircles;
    public float fastestReactionTimeDiamond;
    public float fastestReactionTimeAudio;
    public float timeLasted;
    public int maxObjectCount;
    public string shapeType;
    public string date;
    public string GameType = "AV";
}
public class DataSaver : MonoBehaviour
{
    // private DatabaseReference reference;
    private const float _initialReactionTime = 1000f;
    // private FirebaseAuth auth;
    private int _SquareCount = 6;
    private int _CircleCount = 6;
    private int _TriangleCount = 4;
    private int _DiamondCount = 1;
    private bool _maxObjectCountReached = false;
    private DataToSave _dataToSave = new DataToSave();

    [DllImport("__Internal")]
    private static extern void SendMessageToWebView(string message);

    private void Awake() {
        _dataToSave.fastestReactionTimeSquares = _initialReactionTime;
        _dataToSave.fastestReactionTimeTriangles = _initialReactionTime;
        _dataToSave.fastestReactionTimeCircles = _initialReactionTime;
        _dataToSave.fastestReactionTimeDiamond = _initialReactionTime;
        _dataToSave.fastestReactionTimeAudio = _initialReactionTime;
        _dataToSave.maxObjectCount = 0;
    }

    private void OnEnable()
    {
        LogStatisticsEvents.sendPlayerStatistics += SaveData;
    }

    private void OnDisable()
    {
        LogStatisticsEvents.sendPlayerStatistics -= SaveData;
    }
    
    /*
     * This method decreases the count of the shapes and updates the fastest reaction time for the specific shape.
     * If the count of all shapes is 0, the method returns false which allows the data to be stored in the database.
     */
    private bool DecreaseSquareCount(DataToSave data)
    {
        if (data.shapeType == "square")
        {
            _SquareCount--;
            UpdateFastestReactionTime(data.fastestReactionTimeSquares, data.shapeType);
        } 
        if (data.shapeType == "triangle")
        {
            _TriangleCount--;
            UpdateFastestReactionTime(data.fastestReactionTimeTriangles, data.shapeType);
        } 
        if (data.shapeType == "circle")
        {
            _CircleCount--;
            UpdateFastestReactionTime(data.fastestReactionTimeCircles, data.shapeType);
        }

        if (data.shapeType == "diamond")
        {
            _DiamondCount--;
            UpdateFastestReactionTime(data.fastestReactionTimeDiamond, data.shapeType);
        }
        if(data.shapeType == "audio")
        {
            UpdateFastestReactionTime(data.fastestReactionTimeAudio, data.shapeType);
        }
        if (_SquareCount == 0 && _TriangleCount == 0 && _CircleCount == 0 && _DiamondCount == 0)
        {
            return false;
        }
        return true;
    }
    
    /*
     * This method updates the fastest reaction time for the specific shape.
     */
    private void UpdateFastestReactionTime(float reactionTime, string shapeType)
    {
        if (shapeType == "square" && reactionTime < _dataToSave.fastestReactionTimeSquares)
        {
            _dataToSave.fastestReactionTimeSquares = reactionTime;
        }
        if (shapeType == "triangle" && reactionTime < _dataToSave.fastestReactionTimeTriangles)
        {
            _dataToSave.fastestReactionTimeTriangles = reactionTime;
        }
        if (shapeType == "circle" && reactionTime < _dataToSave.fastestReactionTimeCircles)
        {
            _dataToSave.fastestReactionTimeCircles = reactionTime;
        }
        if (shapeType == "diamond" && reactionTime < _dataToSave.fastestReactionTimeDiamond)
        {
            _dataToSave.fastestReactionTimeDiamond = reactionTime;
        }
        if (shapeType == "audio" && reactionTime < _dataToSave.fastestReactionTimeAudio)
        {
            _dataToSave.fastestReactionTimeAudio = reactionTime;
        }
    }
    
    /*
     * This method checks if the max object count has been received for storing to the dataabase.
     */
    private void CheckMaxObjectCount(DataToSave data)
    {
        if (data.maxObjectCount != 0)
        {
            _dataToSave.maxObjectCount = data.maxObjectCount;
            _maxObjectCountReached = true;
        }
    }

    private void SetTimeLasted(DataToSave data)
    {
        if (_dataToSave.timeLasted == 0)
        { 
            _dataToSave.timeLasted = data.timeLasted;   
        }
        
    }
    
    /*
     * This method saves the data to the database.
     */
    public void SaveData(DataToSave data)
    {
        SetTimeLasted(data);
        CheckMaxObjectCount(data);
        if (DecreaseSquareCount(data))
        {
            return;
        }
        if (!_maxObjectCountReached)
        {
            return;
        }
        LogStatisticsEvents.ShowPLayerStatistics(_dataToSave);
        _dataToSave.date = DateTime.Now.ToString("O");
        string json = JsonUtility.ToJson(_dataToSave);
        SendMessageToWebView(json);

        ResetVariables();
    }

    private void ResetVariables()
    {
        _dataToSave.fastestReactionTimeSquares = _initialReactionTime;
        _dataToSave.fastestReactionTimeTriangles = _initialReactionTime;
        _dataToSave.fastestReactionTimeCircles = _initialReactionTime;
        _dataToSave.fastestReactionTimeDiamond = _initialReactionTime;
        _dataToSave.fastestReactionTimeAudio = _initialReactionTime;
        _dataToSave.timeLasted = 0;
        _dataToSave.maxObjectCount = 0;
        _SquareCount = 6;
        _CircleCount = 6;
        _TriangleCount = 4;
        _DiamondCount = 1;
        _dataToSave.date ="";
        _maxObjectCountReached = false;
    }
}
