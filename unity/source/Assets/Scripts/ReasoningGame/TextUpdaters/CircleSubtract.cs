// ------------------------------------------------------------------------
// CircleSubtract.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;

public class CircleSubtractScript : MonoBehaviour
{
    public AudioSource burst;
    public void OnMouseDown()
    {
        burst.Play();
        GameManager.CircleSubtract();
    }
}
