// ------------------------------------------------------------------------
// BackButton.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;

public class BackButton : MonoBehaviour
{
    private SpriteRenderer _spriteRenderer;
    private void Start()
    {
        _spriteRenderer = GetComponent<SpriteRenderer>();
    }

    private void OnMouseDown()
    {
        GameManager.BackButtonPressed();
        UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
    }
    
}
