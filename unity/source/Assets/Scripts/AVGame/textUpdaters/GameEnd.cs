// ------------------------------------------------------------------------
// GameEnd.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using UnityEngine;
using TMPro;


public class GameEnd : MonoBehaviour
{
    
    public GameObject evaluationWindow;
    public GameObject mainCanvas;
    public SpriteRenderer backButton;
    public SpriteRenderer restartButton;
    public TextMeshProUGUI evaluationText;


    private void Awake()
    {   
        evaluationWindow.SetActive(false);
    }

    private void OnEnable()
    {
        GameManager.avFinished += CountdownFinished;
        LogStatisticsEvents.showPlayerStatistics += SetEvaluationText;
        GameManager.backButtonPressed += NullText;
        GameManager.restartButtonPressed += NullText;
    }

    private void OnDisable()
    {
        GameManager.avFinished -= CountdownFinished;
        LogStatisticsEvents.showPlayerStatistics -= SetEvaluationText;
        GameManager.backButtonPressed -= NullText;
        GameManager.restartButtonPressed -= NullText;
    }

    private void NullText()
    {
        evaluationText.text = "";
    }
    
    private void SetEvaluationText(DataToSave data)
    {
        evaluationText.text = "Time lasted: " + data.timeLasted + "s\n"
                              + "Max objects handeled: " + data.maxObjectCount + "\n"
                              + "For other stats see statistics";
    }
    private void Start()
    {
        evaluationWindow.SetActive(false);
    }

    /*
     * When the countdown is finished, the main canvas is disabled and the evaluation window is enabled.
     */
    private void CountdownFinished()
    {
        mainCanvas.SetActive(false);
        evaluationWindow.SetActive(true);
    }
}