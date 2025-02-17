// ------------------------------------------------------------------------
// ObjectCountTracker.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

using UnityEngine;

namespace AVGame
{
    public class ObjectCountTracker : MonoBehaviour
    {
        private int _currentObjectCount = 0;
        private int _maxObjectCount = 0;
        private DataToSave _dataToSave = new DataToSave();

        private void Start()
        {
            _currentObjectCount = 0;
            _maxObjectCount = 0;
            GameManager.avFinished += SendDataToSave;
            ObjectCountEvents.objectAppeared += IncreaseObjectCount;
            ObjectCountEvents.objectDisappeared += DecreaseObjectCount;
        }
        
        private void IncreaseObjectCount()
        {
            _currentObjectCount++;
            if (_currentObjectCount > _maxObjectCount)
            {
                _maxObjectCount = _currentObjectCount;
            }
            
        }
        
        private void DecreaseObjectCount()
        {
            _currentObjectCount--;
        }
        
        private void SendDataToSave()
        {
            if (this == null) return;
            _dataToSave.maxObjectCount = _maxObjectCount;
            LogStatisticsEvents.SendPLayerStatistics(_dataToSave);
        }
    }
}