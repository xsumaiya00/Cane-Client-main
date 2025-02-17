// ------------------------------------------------------------------------
// SquareSubtract.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;

public class SquareSubtract : MonoBehaviour
{
    public AudioSource burst;
    public void OnMouseDown()
    {
        burst.Play();
        GameManager.SquareSubtract();
    }
}
