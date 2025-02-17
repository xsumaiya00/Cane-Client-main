// ------------------------------------------------------------------------
// ReasoningTriangle.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------



using System.Collections.Generic;
using UnityEngine;
using Random = UnityEngine.Random;

public class ReasoningTriangle : MonoBehaviour
{
    private List<int> _potentialValues = new List<int>();
    private int _currentValue;
    private string _intervalDisplay;
    private int _firstValue = 1;
    private int _clickedCount = 0;
    private SpriteRenderer _triangleObject;
    private int _sum = 0;
    private bool _canAddShape = true;
    
    private int _maxValue;
    private int _minValue;
    private int _midValue;
    public AudioSource burst;
    
    
    /*
     * Add two values to the list of potential values
     */
    private void AddTwoValues()
    {
        for (int i = 0; i < 2; i++)
        {
            _potentialValues.Add(_firstValue);
            _firstValue++;
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
        GameManager.SendSumTriangle(_sum);
    }
    
    private void CreateStringWithInterval()
    {
        _intervalDisplay = "";
        int numberOfValues = _potentialValues.Count;
        _intervalDisplay += _potentialValues[0] + " - ";
        _intervalDisplay += _potentialValues[numberOfValues - 1];
        
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
    
    /*
     * When the shape is clicked, add the value of the shape to the sum
     */
    private void OnMouseDown()
    {
        if (_canAddShape)
        {
            _clickedCount++;
            string count = _clickedCount.ToString();
            GameManager.ChangeTriangleCount(count);
            MinMaxMidEvents.SendClickedCountTriangle(1);
            burst.Play();
            CountMinMaxMid();
            MinMaxMidEvents.SendMinMaxMidTriangle(_minValue, _maxValue, _midValue);   
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
        if(_clickedCount < 0)
        {
            _clickedCount = 0;
        }
        else
        {
            MinMaxMidEvents.SendClickedCountTriangle(-1);
        }
        string count = _clickedCount.ToString();
        GameManager.ChangeTriangleCount(count);
        CountMinMaxMid();
        MinMaxMidEvents.SendMinMaxMidTriangle(_minValue, _maxValue, _midValue);
    }
    private void ResetCount()
    {
        _clickedCount = 0;
        _canAddShape = true;
        string count = _clickedCount.ToString();
        GameManager.ChangeTriangleCount(count);
    }

    private void ResetMinMaxMid()
    {
        _maxValue = 0;
        _midValue = 0;
        _minValue = 0;
        MinMaxMidEvents.SendMinMaxMidTriangle(0,0,0);
    }

    private void NextLevelClicked()
    {   
        ResetMinMaxMid();
        ResetCount();
        AddTwoValues();
        _sum = 0;
        CreateStringWithInterval();
        GameManager.ChangeText(_intervalDisplay);
    }
    private void RestartClicked()
    {
        ResetMinMaxMid();
        ResetCount();   
        _potentialValues.Clear();
        _firstValue = 1;
        _sum = 0;
        AddTwoValues();
        CreateStringWithInterval();
        GameManager.ChangeText(_intervalDisplay);
    }
    void Start()
    {
        AddTwoValues();
        CreateStringWithInterval();
        _triangleObject = GetComponent<SpriteRenderer>();
        GameManager.nextLevel += NextLevelClicked;
        GameManager.firstLevel += RestartClicked;
        GameManager.triangleSubtract += SubtractCount;
        GameManager.levelFinished += GenerateSumWithRandomIntervalNumbers;
        MinMaxMidEvents.sendClickedCountSum += SetCanAddShape;
        GameManager.ChangeText(_intervalDisplay);
        GameManager.ChangeTriangleCount("0");
        MinMaxMidEvents.SendMinMaxMidTriangle(0,0,0);
    }
    
}
