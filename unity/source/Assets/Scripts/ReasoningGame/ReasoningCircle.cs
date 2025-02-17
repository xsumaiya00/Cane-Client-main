// ------------------------------------------------------------------------
// ReasoningCircle.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using System.Collections.Generic;
using UnityEngine;
using Random = UnityEngine.Random;

public class ReasoningCircle : MonoBehaviour
{
    private List<int> _potentialValues = new List<int>();
    private int _currentValue;
    private string _intervalDisplay;
    private int _firstValue = 1;
    private int _intervalSize = 0;
    private int _firstValueCache = 5;
    private int _clickedCount = 0;
    private int _sum = 0;
    private int _maxValue;
    private int _minValue;
    private int _midValue;
    private bool _canAddShape = true;
    private SpriteRenderer _circleObject;
    public AudioSource burst;
    
    
    private void DeleteInterval()
    {
        _potentialValues.Clear();
    }

    private void SetUpInterval()
    {
        _intervalSize += 2;
        _firstValue += 4;
    }
    
    /*
     * Add values to the list of potential values
     */
    private void AddValues()
    {   
        _firstValueCache = _firstValue;
        int valuesToAdd = _intervalSize;
        while(valuesToAdd > 0)
        {
            _potentialValues.Add(_firstValue);
            _firstValue++;
            valuesToAdd--;
        }
        _firstValue = _firstValueCache;
    }
    
    /*
     * Generate sum with random numbers from the interval above the shape
     */
    private void GenerateSumWithRandomIntervalNumbers()
    {   
        for (int i = 0; i < _clickedCount; i++)
        {
            int randomIndex = Random.Range(0, _potentialValues.Count - 1); 
            _sum += _potentialValues[randomIndex];
        }
        GameManager.SendSumCircle(_sum);
    }
    
    private void CreateStringWithInterval()
    {
        _intervalDisplay = "";
        int numberOfValues = _potentialValues.Count;
        _intervalDisplay += _potentialValues[0] + " - ";
        _intervalDisplay += _potentialValues[numberOfValues - 1];
        
    }

    /*
     * When the shape is clicked, add the value of the shape to the sum
     */
    private void OnMouseDown()
    {
        if (_canAddShape)
        {
            MinMaxMidEvents.SendClickedCountCircle(1);
            _clickedCount++;
            burst.Play();
            string count = _clickedCount.ToString();
            GameManager.ChangeCircleCount(count);
            CountMinMaxMid();
            MinMaxMidEvents.SendMinMaxMidCircle(_minValue, _maxValue, _midValue);   
        }
    }

    /*
     * Subtract the value of the shape from the sum
     */
    private void SubtractCount()
    {
        _clickedCount--;
        if (_clickedCount < 0)
        {
            _clickedCount = 0;
        }
        else
        {
            MinMaxMidEvents.SendClickedCountCircle(-1);
        }
        string count = _clickedCount.ToString();
        GameManager.ChangeCircleCount(count);
        CountMinMaxMid();
        MinMaxMidEvents.SendMinMaxMidCircle(_minValue, _maxValue, _midValue);
    }
    
    /*
     * Count the min, max and mid potential sums of the shape
     */
    private void CountMinMaxMid()
    {
        _maxValue = _potentialValues[_potentialValues.Count - 1] * _clickedCount;
        _midValue = _potentialValues[_potentialValues.Count / 2] * _clickedCount;
        _minValue = _potentialValues[0] * _clickedCount;
    }

    
    private void ResetCount()
    {
        _clickedCount = 0;
        _canAddShape = true;
        string count = _clickedCount.ToString();
        GameManager.ChangeCircleCount(count);
    }
    
    private void ResetMinMaxMid()
    {
        _maxValue = 0;
        _midValue = 0;
        _minValue = 0;
        MinMaxMidEvents.SendMinMaxMidCircle(0,0,0);
    }

    private void SetCanAddShape(bool canAddShape)
    {
        _canAddShape = canAddShape;
    }
    
    private void NextLevelClicked()
    {
        ResetMinMaxMid();
        ResetCount();
        DeleteInterval();
        SetUpInterval();
        _sum = 0;
        AddValues();
        CreateStringWithInterval();
        GameManager.ChangeTextCircle(_intervalDisplay);
    }
    private void RestartClicked()
    {
        ResetMinMaxMid();
        ResetCount();
        _intervalSize = 0;
        _firstValue = 1;
        _sum = 0;
        DeleteInterval();
        SetUpInterval();
        AddValues();
        CreateStringWithInterval();
        GameManager.ChangeTextCircle(_intervalDisplay);
    }
    void Start()
    {
        SetUpInterval();
        AddValues();
        CreateStringWithInterval();
        _circleObject = GetComponent<SpriteRenderer>();
        GameManager.nextLevel += NextLevelClicked;
        GameManager.firstLevel += RestartClicked;
        GameManager.circleSubtract += SubtractCount;
        GameManager.levelFinished += GenerateSumWithRandomIntervalNumbers;
        MinMaxMidEvents.sendClickedCountSum += SetCanAddShape;
        GameManager.ChangeTextCircle(_intervalDisplay);
        GameManager.ChangeCircleCount("0");
        MinMaxMidEvents.SendMinMaxMidCircle(0,0,0);
    }
    
}