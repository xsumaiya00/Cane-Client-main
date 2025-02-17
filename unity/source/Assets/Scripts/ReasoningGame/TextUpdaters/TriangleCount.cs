// ------------------------------------------------------------------------
// TriangleCount.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using TMPro;
using UnityEngine;

public class TriangleCount : MonoBehaviour
{
    private TextMeshProUGUI _textField;

    

    public void Awake()
    {
        _textField = GetComponent<TextMeshProUGUI>();
        GameManager.changeCountTriangle += UpdateText;
    }

    private void UpdateText(string newText)
    {
        if (newText != null)
        {
            _textField.text = newText;
        }
    }
}