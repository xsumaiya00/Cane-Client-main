// ------------------------------------------------------------------------
// LineGraphMaxObjectsCount.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------


using UnityEngine;
using System.Collections.Generic;
using UnityEngine.UI;
using TMPro;

public class LineGraphMaxObjectsCount : MonoBehaviour
{
    [SerializeField] private Sprite _pointPrefab;
    private RectTransform graphContainer;
    public DataGetter _dataGetter;
    public string type;
    public TextMeshProUGUI lastTickText;
    private List<float> scores = new List<float>();
    private Dictionary<string, List<float>> typeToListMap;

    protected void Awake()
    {
        LogStatisticsEvents.dataRetrievedMaxObjectCount += OnDataRetrieved;
        graphContainer = GetComponent<RectTransform>();
        InitializeTypeToListMap();
    }
    private void Start()
    {
        _dataGetter.GetPlayerData(type);
    }
    protected void OnDestroy()
    {
        LogStatisticsEvents.dataRetrievedMaxObjectCount -= OnDataRetrieved;
    }
    protected virtual void OnDataRetrieved()
    {
        CreateAxis();
        CreateTicks();
        ShowNextGraph(type);
    }

    protected void InitializeTypeToListMap()
    {
        typeToListMap = new Dictionary<string, List<float>>
        {
            {"circles", _dataGetter.reactionTimeLists.reactionTimesCircles},
            {"squares", _dataGetter.reactionTimeLists.reactionTimesSquares},
            {"triangles", _dataGetter.reactionTimeLists.reactionTimesTriangles},
            {"diamonds", _dataGetter.reactionTimeLists.reactionTimesDiamonds},
            {"audio", _dataGetter.reactionTimeLists.reactionTimesAudio},
            {"timeLasted", _dataGetter.reactionTimeLists.timeLasted},
            {"maxObjectCount", _dataGetter.reactionTimeLists.maxObjectCount}
        };
    }
    
    /*
     * Asignes the scores variable used to draw the graph
     */
    protected void ShowNextGraph(string type)
    {   
        scores.Clear();
        if (typeToListMap.TryGetValue(type, out var selectedScores))
        {
            scores = selectedScores;
        }
        else
        {
            Debug.LogError("unknown type");
            return;
        }
        RemoveDefaultFromData();
        AssignMidAndLastTickText();
        ShowGraph(scores);
    }

    protected void RemoveDefaultFromData()
    {
        scores.RemoveAll(x => x == 1000);
    }
    
    //the following code for creating graphs is inspired by a programmer with an online pseudonym "Code Monkey"
    //link to his website: https://unitycodemonkey.com/video.php?v=CmU5-v-v1Qo
    
    /**
     * Creates a prefab point for the graph points
     */
    protected GameObject CreatePrefab(Vector2 anchoredPosition)
    {
        GameObject gameObject = new GameObject("point", typeof(Image));
        gameObject.transform.SetParent(graphContainer, false);
        gameObject.GetComponent<Image>().sprite = _pointPrefab;
        
        RectTransform rectTransform = gameObject.GetComponent<RectTransform>();
        rectTransform.anchoredPosition = anchoredPosition;
        rectTransform.sizeDelta = new Vector2(11, 11);
        rectTransform.anchorMin = new Vector2(0, 0);
        rectTransform.anchorMax = new Vector2(0, 0);

        return gameObject;
    }

    /*
     * Creates actual points and connections between them
     */
    protected void ShowGraph(List<float> valueList)
    {
        float graphHeight = graphContainer.sizeDelta.y - 150;
        float graphWidth = graphContainer.sizeDelta.x - 140;
        float yMaximum = 17f;
        float xStep = (valueList.Count > 1) ? graphWidth / (valueList.Count - 1) : graphWidth;

        GameObject lastPointObject = null;
        for (int i = 0; i < valueList.Count; i++)
        {
            float xPosition = 65 + i * xStep;
            float yValue = Mathf.Clamp(valueList[i], 0, yMaximum);
            float yPosition = (yValue / yMaximum) * graphHeight + 75; 
            GameObject pointGameObject = CreatePrefab(new Vector2(xPosition, yPosition));
            if (lastPointObject != null)
            {
                CreateDotConnection(lastPointObject.GetComponent<RectTransform>().anchoredPosition, 
                    pointGameObject.GetComponent<RectTransform>().anchoredPosition);
            }
            lastPointObject = pointGameObject;
        }
    }


    /*
     * Function used for creating connections between points
     */
    protected void CreateDotConnection(Vector2 dotPositionA, Vector2 dotPositionB)
    {
        GameObject gameObject = new GameObject("dotConnection", typeof(Image));
        gameObject.transform.SetParent(graphContainer, false);
        gameObject.GetComponent<Image>().color = new Color(1, 1, 1, .5f);
        RectTransform rectTransform = gameObject.GetComponent<RectTransform>();
        Vector2 dir = (dotPositionB - dotPositionA).normalized;
        float distance = Vector2.Distance(dotPositionA, dotPositionB);
        rectTransform.anchorMin = new Vector2(0, 0);
        rectTransform.anchorMax = new Vector2(0, 0);
        rectTransform.sizeDelta = new Vector2(distance, 4f);
        rectTransform.anchoredPosition = dotPositionA + dir * distance * 0.5f;
        rectTransform.localEulerAngles = new Vector3(0, 0, GetAngleFromVector(dir));
    }
    
    /*
     * Function used for calculating the angle of the connection between points
     */
    protected float GetAngleFromVector(Vector2 dir)
    {
        float angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
        return angle;
    }
    
    /*
     * Function used for creating the axes of the graph
     */
    protected void CreateAxis()
    {
        float paddingLeftAxis = 430f;
        float paddingBottomAxis = 370f;
        float padding = 30f;
        float shiftLeft = 65f;
        float shiftBottom = 75f;
        float graphWidth = graphContainer.sizeDelta.x;
        float graphHeight = graphContainer.sizeDelta.y;
        
        Vector2 bottomLeft = new Vector2(padding, padding);
        
        GameObject bottomAxis = CreateAxisLine(new Vector2(graphWidth, 4f), 
                                new Vector2(paddingBottomAxis, shiftBottom)); 
        GameObject leftAxis = CreateAxisLine(new Vector2(4f, graphHeight-40), 
                                new Vector2(shiftLeft, paddingLeftAxis));

    }

    /*
     * Function used for creating axis lines
     */
    protected GameObject CreateAxisLine(Vector2 size, Vector2 anchoredPosition)
    {
        GameObject gameObject = new GameObject("axis", typeof(Image));
        gameObject.transform.SetParent(graphContainer, false);
        gameObject.GetComponent<Image>().color = Color.white;
        RectTransform rectTransform = gameObject.GetComponent<RectTransform>();
        rectTransform.sizeDelta = size;
        rectTransform.anchoredPosition = anchoredPosition;
        rectTransform.anchorMin = new Vector2(0, 0);
        rectTransform.anchorMax = new Vector2(0, 0);
        rectTransform.pivot = new Vector2(0.5f, 0.5f);
        return gameObject;
    }

    /*
     * Function used for creating ticks on the axes
     */
    protected void CreateTicks()
    {
        float graphHeight = graphContainer.sizeDelta.y;
        float yMaximum = 17f;
        float yIncrement = yMaximum / 17;
        float tickSpacing = (graphHeight-140) / 17;

        for (int i = 0; i <= 17; i++) 
        {
            float yPosition = 75 + i * tickSpacing;
        
            CreateTick(new Vector2(20f, 4f), new Vector2(75, yPosition));
        }
        graphHeight = graphContainer.sizeDelta.y;
        yMaximum = 3f;
        yIncrement = yMaximum / 15;
        tickSpacing = (graphHeight-140) / 15; 

        for (int i = 0; i <= 15 ; i++) 
        {
            float xPosition = 65 + i * tickSpacing;
            
            CreateTick(new Vector2(4f, 20f), new Vector2(xPosition, 75));
        }
    }
    
    /*
     * Function that assigns the text of the middle and last tick
     */
    public void AssignMidAndLastTickText()
    {
        int count = scores.Count;
        if (count == 1)
        {
            lastTickText.text = "14";
            return;
        }
        lastTickText.text = count.ToString();
    }

    /*
     * Function used for creating ticks
     */
    protected GameObject CreateTick(Vector2 size, Vector2 anchoredPosition)
    {
        GameObject gameObject = new GameObject("tick", typeof(Image));
        gameObject.transform.SetParent(graphContainer, false);
        gameObject.GetComponent<Image>().color = Color.white;
        RectTransform rectTransform = gameObject.GetComponent<RectTransform>();
        rectTransform.sizeDelta = size;
        rectTransform.anchoredPosition = anchoredPosition;
        rectTransform.anchorMin = new Vector2(0, 0);
        rectTransform.anchorMax = new Vector2(0, 0);
        rectTransform.pivot = new Vector2(0.5f, 0.5f);
        return gameObject;
    }

}