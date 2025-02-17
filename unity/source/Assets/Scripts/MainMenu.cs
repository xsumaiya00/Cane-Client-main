// ------------------------------------------------------------------------
// MainMenu.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------
// This class is used for transitioning to different scense in the application.

using UnityEngine;
public class MainMenu : MonoBehaviour
{
    
   public GameObject guestPanel;

   public void Awake()
   {
       if (GameManager.isGuest)
       {
           guestPanel.SetActive(true);
       }
       else
       {
           guestPanel.SetActive(false);
       }
   }

   public void playGame()
   {
       UnityEngine.SceneManagement.SceneManager.LoadScene("MainScene");
   }
   public void Statistics()
   {
       if (GameManager.isGuest)
       {
           return;
       }
       UnityEngine.SceneManagement.SceneManager.LoadScene("Stats");
   }
   
   public void quitGame()
   {
       GameManager.isGuest = false;
       guestPanel.SetActive(false);
       Application.Quit();
   }
   public void ReasoningGame()
   {
       UnityEngine.SceneManagement.SceneManager.LoadScene("ReasoningScene");
   }
   public void Help()
   {
       UnityEngine.SceneManagement.SceneManager.LoadScene("Help");
   }
   public void Back()
   {
       UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
   }
   public void BackAV()
   {    
       GameManager.BackButtonPressed();
       UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
   }

   public void RestartAV()
   {
       GameManager.RestartButtonPressed();
         UnityEngine.SceneManagement.SceneManager.LoadScene("MainScene");
   }
   public void BackReasoning()
   {
       UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
   }
   public void NextLevelReasoning()
   {
       GameManager.NextLevel();
   }
   public void RestartReasoning()
   {
       GameManager.RestartClicked();
   }
}
