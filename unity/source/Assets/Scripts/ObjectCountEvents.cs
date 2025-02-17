// ------------------------------------------------------------------------
// ObjectCountEvents.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------
// This class is used for managing the events that are
// triggered when the application wants to calculate the number of objects in the audio-visual scene.

using UnityEngine;
using UnityEngine.Events;

public class ObjectCountEvents : MonoBehaviour
{
    public static event UnityAction objectAppeared;
    public static event UnityAction objectDisappeared;

    public static void ObjectAppeared()
    {
        objectAppeared?.Invoke();
    }

    public static void ObjectDisappeared()//
    {
        objectDisappeared?.Invoke();
    }
}