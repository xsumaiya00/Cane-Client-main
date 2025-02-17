// ------------------------------------------------------------------------
// TriangleSubtract.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;

public class TriangleSubtract : MonoBehaviour
{
    public AudioSource burst;
    public void OnMouseDown()
    {
        GameManager.TriangleSubtract();
        burst.Play();
    }
}
