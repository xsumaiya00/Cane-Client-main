// ------------------------------------------------------------------------
// HandleNoise.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using System.Collections;
using UnityEngine;

public class TimedSprite : MonoBehaviour
{
    public AudioSource audioSource;
    public AudioSource ClickedAudioSource;

    public float minTimeBeforeBeep = 5f;
    public float maxTimeBeforeBeep = 10f;
    
    private const float InitialReactionTime = 1000f;
    private float _reactionTime = 0f;
    private float _timeSoundPlayed = 0f;
    private DataToSave _dataToSave = new DataToSave();

    private bool _canAddTime = false;

    void Start()
    {
        GameManager.avFinished += SendDataToSave;
        _dataToSave.fastestReactionTimeAudio = InitialReactionTime;
        _dataToSave.shapeType = "audio";
        StartBeepRoutine();
    }
    
    /*
     * Starts the routine that plays the beep sound and allows the player to click.
     */
    public void StartBeepRoutine()
    {
        StartCoroutine(BeepAndAllowPressRoutine());
    }

    /*
     * Coroutine that plays the beep sound and allows the player to click.
     */
    private IEnumerator BeepAndAllowPressRoutine()
    {
        float randomInterval = UnityEngine.Random.Range(minTimeBeforeBeep, maxTimeBeforeBeep);
        yield return new WaitForSeconds(randomInterval);

        _canAddTime = true;
        audioSource.Play();
        _timeSoundPlayed = Time.time;
        yield return new WaitForSeconds(2);

        _canAddTime = false;
        GameManager.ShapeMissed();
        
        StartBeepRoutine();
    }
    
    /*
     * Called through an event, when the player clicks on the sprite.
     */
    public void Clicked()
    {
        ClickedAudioSource.Play();
        if (_canAddTime)
        {
            Debug.Log("Correct timing! Time added.");
            _canAddTime = false;
            _reactionTime = Time.time - _timeSoundPlayed;
            UpdateReactionTime();
            StopAllCoroutines();
            StartBeepRoutine();
        }
        else
        {
            Debug.Log("Wrong timing!");
            GameManager.ShapeMissed();
            StopAllCoroutines();
            StartBeepRoutine();
        }
    }
    
    /*
     * Sends the data to be saved and destroys the object.
     */
    private void SendDataToSave()
    {
        if (this == null) return;
        LogStatisticsEvents.SendPLayerStatistics(_dataToSave);
        _dataToSave.fastestReactionTimeAudio = InitialReactionTime;
        _reactionTime = 0;
        Destroy(gameObject);
    }
    private void UpdateReactionTime()
    {
        if (_reactionTime < _dataToSave.fastestReactionTimeAudio)
        {
            _dataToSave.fastestReactionTimeAudio = _reactionTime;
        }
    }
}
