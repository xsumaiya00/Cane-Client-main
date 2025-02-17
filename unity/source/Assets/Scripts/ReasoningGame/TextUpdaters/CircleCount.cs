// ------------------------------------------------------------------------
// CircleCount.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using TMPro;
using UnityEngine;

public class CircleCount : MonoBehaviour
{
    private TextMeshProUGUI _textField;

    

    public void Awake()
    {
        _textField = GetComponent<TextMeshProUGUI>();
        GameManager.changeCountCircle += UpdateText;
    }

    private void UpdateText(string newText)
    {
        if (newText != null)
        {
            _textField.text = newText;
        }
    }
}