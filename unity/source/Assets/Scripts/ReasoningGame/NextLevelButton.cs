// ------------------------------------------------------------------------
// NextLevelButton.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;

public class NextLevelButton : MonoBehaviour
{
    private SpriteRenderer _spriteRenderer;
    void Start()
    {
        _spriteRenderer = GetComponent<SpriteRenderer>();
    }

private void OnMouseDown()
    {
        GameManager.NextLevel();
    }
}
