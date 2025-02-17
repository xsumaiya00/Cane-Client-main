// ------------------------------------------------------------------------
// SliderTime.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using UnityEngine;
using UnityEngine.UI;

public class TimeBar : MonoBehaviour
{
    public Slider timeSlider;
    private float _gameTime = 60f;
    private float _timeAccelerationCoeficient = 1f;
    private float _timeRemaining;
    private DataToSave _dataToSave = new DataToSave();
    private float increaseInterval = 10f;
    private float timeRemaining;
    private float _timeLasted;
    private float _maxTimeAcceleration = 2f;

    private void Awake()
    {
        GameManager.onShapeClicked += AddTimeToSlider;
        GameManager.shapeMissed += SubtractTimeFromSlider;
        GameManager.backButtonPressed += DestroySlider;
    }

    private void OnDestroy()
    {
        GameManager.onShapeClicked -= AddTimeToSlider;
        GameManager.shapeMissed -= SubtractTimeFromSlider;
        GameManager.backButtonPressed -= DestroySlider;
        
    }

    private void Start()
    {
        timeRemaining = _gameTime;
        timeSlider.maxValue = _gameTime;
        timeSlider.value = _gameTime;
    }
    
    private void DestroySlider()
    {
        Destroy(gameObject);
    }
    
    /*
     * Updates the time slider and checks if the time has run out.
     */
    private void Update()
    {   
        if (timeRemaining > 0)
        {
            timeRemaining -= Time.deltaTime * _timeAccelerationCoeficient;
            _timeLasted += Time.deltaTime;
            timeSlider.value = timeRemaining;
        }
        else
        {
            TimeOut();
        }
        if(_timeAccelerationCoeficient < _maxTimeAcceleration)
        {
            _timeAccelerationCoeficient += 0.0001f;
        }
    }
    
    /*
     * Called when the time runs out.
     */
    private void TimeOut()
    {
        RestartGame();
        _dataToSave.timeLasted = _timeLasted;
        LogStatisticsEvents.SendPLayerStatistics(_dataToSave);    
        GameManager.AVFinished();
    }
    
    
    private void RestartGame()
    {
        timeRemaining = _gameTime;
        timeSlider.value = _gameTime;
    }
    
    private void AddTimeToSlider()
    {
        timeRemaining += 10f;
        checkTimeOverflow();
        timeSlider.value = timeRemaining;
    }
    
    private void SubtractTimeFromSlider()
    {
        timeRemaining -= 5f;
        checkTimeOverflow();
        timeSlider.value = timeRemaining;
    }
    
    /*
     * If the time remaining is greater after clicking the diamond, set it to the maximum time.
     */
    private void checkTimeOverflow()
    {
        if (timeRemaining > _gameTime)
        {
            timeRemaining = _gameTime;
        }
    }
}