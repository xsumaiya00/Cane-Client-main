// ------------------------------------------------------------------------
// MinMaxMidEvents.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------
// This class is used for managing the events that are triggered when the application wants to
// set the min max and mid values for the reasoning game.

using UnityEngine;
using UnityEngine.Events;

public class MinMaxMidEvents : MonoBehaviour
{
    public static event UnityAction<int> sendClickedCountTriangle;
    public static event UnityAction<int> sendClickedCountSquare;
    public static event UnityAction<int> sendClickedCountCircle;
    public static event UnityAction<bool> sendClickedCountSum;
    public static event UnityAction<int, int, int> sendMinMaxMidSquare;
    public static event UnityAction<int, int, int> sendMinMaxMidTriangle;
    public static event UnityAction<int, int, int> sendMinMaxMidCircle;
    
    public static void SendMinMaxMidSquare(int min, int max, int mid)
    {
        sendMinMaxMidSquare?.Invoke(min, max, mid);
    }
    
    public static void SendMinMaxMidTriangle(int min, int max, int mid)
    {
        sendMinMaxMidTriangle?.Invoke(min, max, mid);
    }

    public static void SendMinMaxMidCircle(int min, int max, int mid)
    {
        sendMinMaxMidCircle?.Invoke(min, max, mid);
    }
    public static void SendClickedCountTriangle(int clickedCount)
    {
        sendClickedCountTriangle?.Invoke(clickedCount);
    }
    public static void SendClickedCountSquare(int clickedCount)
    {
        sendClickedCountSquare?.Invoke(clickedCount);
    }
    public static void SendClickedCountCircle(int clickedCount)
    {
        sendClickedCountCircle?.Invoke(clickedCount);
    }
    public static void SendClickedCountSum(bool canAddShape)
    {
        sendClickedCountSum?.Invoke(canAddShape);
    }
    

}
