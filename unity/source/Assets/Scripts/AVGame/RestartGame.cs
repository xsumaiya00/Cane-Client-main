// ------------------------------------------------------------------------
// RestartGame.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using UnityEngine;

public class RestartGame : MonoBehaviour
{
    private void OnMouseDown()
    {
        GameManager.RestartButtonPressed();
        UnityEngine.SceneManagement.SceneManager.LoadScene("MainScene");
    }
}
