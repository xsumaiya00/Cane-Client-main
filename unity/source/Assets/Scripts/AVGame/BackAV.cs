// ------------------------------------------------------------------------
// BackAV.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using UnityEngine;

public class BackAV : MonoBehaviour
{
    private SpriteRenderer _spriteRenderer;
    void Start()
    {
        _spriteRenderer = GetComponent<SpriteRenderer>();
    }

    private void OnMouseDown()
    {
        GameManager.BackButtonPressed();
        UnityEngine.SceneManagement.SceneManager.LoadScene("MenuScene");
    }
}
