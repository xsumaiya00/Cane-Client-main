// ------------------------------------------------------------------------
// UpdateMin.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using TMPro;
using UnityEngine;

public class UpdateMin : MonoBehaviour
{
    private TextMeshProUGUI _textField;

    private int _minSum = 0;
    private int _maxSum = 0;
    private int _midSum = 0;
    
    private int _lastTriangleMin;
    private int _lastTriangleMax;
    private int _lastTriangleMid;
    private int _lastCircleMin;
    private int _lastCircleMax;
    private int _lastCircleMid;
    private int _lastSquareMin;
    private int _lastSquareMax; 
    private int _lastSquareMid;

    public void Awake()
    {
        _textField = GetComponent<TextMeshProUGUI>();
        MinMaxMidEvents.sendMinMaxMidSquare += UpdateSquare;
        MinMaxMidEvents.sendMinMaxMidTriangle += UpdateCircle;
        MinMaxMidEvents.sendMinMaxMidCircle += UpdateTriangle;
    }
    
    /*
     * Update the min, max and mid values of the square
     * Then update the sum of all min, max and mid values
     */
    private void UpdateSquare(int min, int max, int mid)
    {
        _lastSquareMin = min;
        _lastSquareMax = max;
        _lastSquareMid = mid;
        UpdateSum();
    }
    
    /*
     * Update the min, max and mid values of the circle
     * Then update the sum of all min, max and mid values
     */
    private void UpdateCircle(int min, int max, int mid)
    {
        _lastCircleMin = min;
        _lastCircleMax = max;
        _lastCircleMid = mid;
        UpdateSum();
    }
    
    /*
     * Update the min, max and mid values of the triangle
     * Then update the sum of all min, max and mid values
     */
    private void UpdateTriangle(int min, int max, int mid)
    {
        _lastTriangleMin = min;
        _lastTriangleMax = max;
        _lastTriangleMid = mid;
        UpdateSum();
    }
    
    /*
     * Update the sum of all min, max and mid values
     */
    private void UpdateSum()
    {
        _minSum = _lastTriangleMin + _lastCircleMin + _lastSquareMin;
        _maxSum = _lastTriangleMax + _lastCircleMax + _lastSquareMax;
        _midSum = _lastTriangleMid + _lastCircleMid + _lastSquareMid;
        UpdateText(_minSum, _maxSum, _midSum);
        ZeroSum();
    }
    
    
    /*
     * Set the sum of all min, max and mid values to 0
     */
    private void ZeroSum()
    {
        _minSum = 0;
        _maxSum = 0;
        _midSum = 0;
    }
    
    /*
     * Update the text of the min, max and mid UI element
     */
    private void UpdateText(int min, int max, int mid)
    {
        if (min != null)
        {
            _textField.text = "Min: " + min + " Mid: " + mid + " Max: " + max;
        }
    }
}