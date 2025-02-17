// ------------------------------------------------------------------------
// GameManager.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------
// This class is used for managing the game.
// It contains events that are triggered when the player interacts with the game.


using UnityEngine;
using UnityEngine.Events;

public class GameManager : MonoBehaviour
{
    
    public static bool isGuest;
    
    public static event UnityAction onShapeClicked; 
    
    public static event UnityAction shapeMissed;
    
    public static event UnityAction nextLevel;
    public static event UnityAction firstLevel;
    
    public static event UnityAction<string> changeText;
    public static event UnityAction<string> changeTextSquare;
    public static event UnityAction<string> changeTextCircle;
    public static event UnityAction<string> changeCountTriangle;
    public static event UnityAction<string> changeCountSquare;
    public static event UnityAction<string> changeCountCircle;
    public static event UnityAction<int> sendSumSquare;
    public static event UnityAction<int> sendSumCircle;
    public static event UnityAction<int> sendSumTriangle;
    public static event UnityAction triangleSubtract;
    public static event UnityAction squareSubtract;
    public static event UnityAction circleSubtract;
    public static event UnityAction levelFinished;
    public static event UnityAction avFinished;
    public static event UnityAction backButtonPressed;
    public static event UnityAction restartButtonPressed;
    
    
    public static void ShapeClicked()
    {
        onShapeClicked?.Invoke();
    }
    
    public static void ShapeMissed()
    {
        shapeMissed?.Invoke();
    }
    
    public static void ChangeText(string newText)
    {
        changeText?.Invoke(newText);
    }
    
    public static void NextLevel()
    {
        nextLevel?.Invoke();
    }
    public static void RestartClicked()
    {
        firstLevel?.Invoke();
    }
    public static void ChangeTextSquare(string newText)
    {
        changeTextSquare?.Invoke(newText);
    }
    public static void ChangeTextCircle(string newText)
    {
        changeTextCircle?.Invoke(newText);
    }
    public static void TriangleSubtract()
    {
        triangleSubtract?.Invoke();
    }
    public static void SquareSubtract()
    {
        squareSubtract?.Invoke();
    }
    public static void CircleSubtract()
    {
        circleSubtract?.Invoke();
    }
    public static void ChangeTriangleCount(string newText)
    {
        changeCountTriangle?.Invoke(newText);
    }
    public static void ChangeSquareCount(string newText)
    {
        changeCountSquare?.Invoke(newText);
    }
    public static void ChangeCircleCount(string newText)
    {
        changeCountCircle?.Invoke(newText);
    }
    public static void SendSumSquare(int sum)
    {
        sendSumSquare?.Invoke(sum);
    }
    public static void SendSumTriangle(int sum)
    {
        sendSumTriangle?.Invoke(sum);
    }
    public static void SendSumCircle(int sum)
    {
        sendSumCircle?.Invoke(sum);
    }

    public static void LevelFinished()
    {
        levelFinished?.Invoke();
    }
    public static void AVFinished()
    {
        avFinished?.Invoke();
    }
    public static void BackButtonPressed()
    {
        backButtonPressed?.Invoke();
    }
    public static void RestartButtonPressed()
    {
        restartButtonPressed?.Invoke();
    }

}