// ------------------------------------------------------------------------
// ReasoningSquare.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using System;
using System.Collections.Generic;
using UnityEngine;
using Random = UnityEngine.Random;

public class ReasoningSquare : MonoBehaviour
{
    private List<int> _potentialValues = new List<int>();
    private int _currentValue;
    private string _intervalDisplay;
    private int _firstValue = 3;
    private int _clickedCount = 0;
    private int _maxValue;
    private int _minValue;
    private int _midValue;
    private int _sum = 0;
    private bool _canAddShape = true;
    private SpriteRenderer _squareObject;
    public AudioSource burst;
    
    
    /*
     * Add two values to the list of potential values
     */
    private void AddTwoValuesFirst()
    {
        for (int i = 0; i < 2; i++)
        {
            _potentialValues.Add(_firstValue);
            _firstValue++;
        }
    }
    
    /*
     * Add four values to the list of potential values
     */
    private void AddFourValues()
    {
        for (int i = 0; i < 4; i++)
        {
            _potentialValues.Add(_firstValue);
            _firstValue++;
        }
    }
    
    /*
     * Remove first two values from the list of potential values
     */
    private void SubtractFirstTwoValues()
    {
        for (int i = 0; i < 2; i++)
        {
            _potentialValues.RemoveAt(0);
        }
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
        GameManager.SendSumSquare(_sum);
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
            _clickedCount++;
            string count = _clickedCount.ToString();
            GameManager.ChangeSquareCount(count);
            burst.Play();
            MinMaxMidEvents.SendClickedCountSquare(1);
            CountMinMaxMid();
            MinMaxMidEvents.SendMinMaxMidSquare(_minValue, _maxValue, _midValue);   
        }
    }
    private void SetCanAddShape(bool canAddShape)
    {
        _canAddShape = canAddShape;
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
            MinMaxMidEvents.SendClickedCountSquare(-1);
        }
        string count = _clickedCount.ToString();
        GameManager.ChangeSquareCount(count);
        CountMinMaxMid();
        MinMaxMidEvents.SendMinMaxMidSquare(_minValue, _maxValue, _midValue);
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
        GameManager.ChangeSquareCount(count);
    }
    private void ResetMinMaxMid()
    {
        _maxValue = 0;
        _midValue = 0;
        _minValue = 0;
        MinMaxMidEvents.SendMinMaxMidSquare(0,0,0);
    }
    private void NextLevelClicked()
    {   
        ResetMinMaxMid();
        ResetCount();
        _sum = 0;
        SubtractFirstTwoValues();
        AddFourValues();   
        CreateStringWithInterval();
        GameManager.ChangeTextSquare(_intervalDisplay);
    }
    
    private void RestartClicked()
    {
        ResetMinMaxMid();
        ResetCount();
        _potentialValues.Clear();
        _firstValue = 3;
        _sum = 0;
        AddTwoValuesFirst();
        CreateStringWithInterval();
        GameManager.ChangeTextSquare(_intervalDisplay);
    }
    void Start()
    {
        Random.InitState(DateTime.Now.Millisecond);
        AddTwoValuesFirst();
        CreateStringWithInterval();
        _squareObject = GetComponent<SpriteRenderer>();
        GameManager.nextLevel += NextLevelClicked;
        GameManager.firstLevel += RestartClicked;
        GameManager.squareSubtract += SubtractCount;
        GameManager.levelFinished += GenerateSumWithRandomIntervalNumbers;
        MinMaxMidEvents.sendClickedCountSum += SetCanAddShape;
        GameManager.ChangeTextSquare(_intervalDisplay);
        GameManager.ChangeSquareCount("0");
        MinMaxMidEvents.SendMinMaxMidSquare(0,0,0);
    }
    
    
}