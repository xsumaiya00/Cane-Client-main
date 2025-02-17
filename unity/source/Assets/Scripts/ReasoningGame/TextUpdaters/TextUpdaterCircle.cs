// ------------------------------------------------------------------------
// TextUpdaterCircle.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using TMPro;
using UnityEngine;

public class TextUpdaterCircle : MonoBehaviour
{
    private TextMeshProUGUI _textField;

    

    public void Awake()
    {
        _textField = GetComponent<TextMeshProUGUI>();
        GameManager.changeTextCircle += UpdateText;
    }

    private void UpdateText(string newText)
    {
        if (newText != null)
        {
            _textField.text = newText;
        }
    }
}