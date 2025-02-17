// ------------------------------------------------------------------------
// Diamond.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using System.Collections;
using UnityEngine;

public class Diamond : MonoBehaviour
{
    private const float CountdownInterval = 4f;
    private const float RandomAppearanceIntervalMax = 15f;
    private const float RandomAppearanceIntervalMin = 10f;
    private const float VisibleInterval = 1f;
    private const float InitialReactionTime = 1000f;
    private float _reactionTime = 0f;
    private float _timeShapeAppeared = 0f;
    private DataToSave _dataToSave = new DataToSave();
    private IEnumerator _currentRandomAppearanceCoroutine;
    private IEnumerator _currentHideTriangleCoroutine;
    private SpriteRenderer _spriteRenderer;
    public AudioSource burst;
    private bool Clickable = false;

    private void Start()
    {
        
        _spriteRenderer = GetComponent<SpriteRenderer>();
        GameManager.avFinished += SendDataToSave;
        GameManager.backButtonPressed += DestroyObject;
        _spriteRenderer = GetComponent<SpriteRenderer>();
        _dataToSave.fastestReactionTimeDiamond = InitialReactionTime;
        _dataToSave.shapeType = "diamond";
        StartCoroutine(TurnOffOnCountdown(CountdownInterval));
        StartCoroutine(StartAfterCountdown());
    }
    
    private void OnDestroy()
    {
        GameManager.backButtonPressed -= DestroyObject;
    }
    private void DestroyObject()
    {
        Destroy(gameObject);
    }
    
    /*
     * Sends the data to be saved and destroys the object.
     */
    private void SendDataToSave()
    {
        if (this == null || _spriteRenderer == null) return;
        LogStatisticsEvents.SendPLayerStatistics(_dataToSave);
        _dataToSave.fastestReactionTimeDiamond = InitialReactionTime;
        _reactionTime = 0;
        Destroy(gameObject);
    }
    
    /*
     * Starts the random appearance coroutine of the object after the countdown.
     */
    private IEnumerator StartAfterCountdown()
    {
        yield return new WaitForSeconds(CountdownInterval);
        Clickable = true;
        RandomAppearance();
    }

    /*
     * Turns off the object after the countdown interval.
     */
    private IEnumerator TurnOffOnCountdown(float countDownInterval)
    {
        yield return new WaitForSeconds(countDownInterval);
        ToggleVisibility();
    }
    
    /*
     * Starts the random appearance coroutine of the object after a random interval.
     */
    private void RandomAppearance()
    {
        float randomInterval = UnityEngine.Random.Range(RandomAppearanceIntervalMin, RandomAppearanceIntervalMax);
        _currentRandomAppearanceCoroutine = AppearAfterRandomInterval(randomInterval);
        StartCoroutine(_currentRandomAppearanceCoroutine);
    }
    
    /*
     * Defines the appearance of the object after a random interval coroutine
     */
    private IEnumerator AppearAfterRandomInterval(float delay)
    {   
        yield return new WaitForSeconds(delay);
        ToggleVisibility();
        ObjectCountEvents.ObjectAppeared();
        _timeShapeAppeared = Time.time;
        _currentHideTriangleCoroutine = HideTriangleAfterVisibleDelay();
        StartCoroutine(_currentHideTriangleCoroutine);
    }
    
    /*
     * Hides the object after the visible interval.
     */
    private IEnumerator HideTriangleAfterVisibleDelay()
    {
        yield return new WaitForSeconds(VisibleInterval);
        ToggleVisibility();
        ObjectCountEvents.ObjectDisappeared();
        RandomAppearance();
    }
    
    /*
     * Stops the active coroutine, toggles the visibility,
     * plays the burst sound, updates the reaction time and hides the object.
     * Then starts the random appearance coroutine again.
     */
    private void OnMouseDown()
    {
        if (IsVisible() && Clickable)
        {
            GameManager.ShapeClicked();
            StopActiveCoroutine();
            ToggleVisibility();
            burst.Play();
            ObjectCountEvents.ObjectDisappeared();
            _reactionTime = Time.time - _timeShapeAppeared;
            UpdateReactionTime();
            RandomAppearance();
        }
    }
    
    /*
     * Updates the fastest reaction time if the current reaction time is faster.
     */
    private void UpdateReactionTime()
    {
        if (_reactionTime < _dataToSave.fastestReactionTimeDiamond)
        {
            _dataToSave.fastestReactionTimeDiamond = _reactionTime;
        }
    }
    
    private void StopActiveCoroutine()
    {
        if (_currentRandomAppearanceCoroutine != null)
        {
            StopCoroutine(_currentRandomAppearanceCoroutine);
        }

        if (_currentHideTriangleCoroutine != null)
        {
            StopCoroutine(_currentHideTriangleCoroutine);
        }
    }
    private bool IsVisible()
    {
        return _spriteRenderer.enabled;
    }
    private void ToggleVisibility()
    {
        _spriteRenderer.enabled = !_spriteRenderer.enabled;
    }
}