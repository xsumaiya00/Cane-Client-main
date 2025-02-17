// ------------------------------------------------------------------------
// DataGetterReasoning.cs
// ------------------------------------------------------------------------
// Project: BachelorThesis
// Author: Stepan Pejchar
// ------------------------------------------------------------------------

//The script is based on the firebase Unity documentation: https://firebase.google.com/docs/unity/setup

using System;
using System.Collections.Generic;
// using Firebase.Auth;
// using Firebase.Database;
// using Firebase.Extensions;
using UnityEngine;

/*
 * This class is used for storing the data from the database for the Reasoning game.
 */
public class ReasoningDataLists
{
    public List<int> desiredAmount = new List<int>();
    public List<int> level = new List<int>();
    public List<int> finalAmount = new List<int>();
    public List<int> desiredFinalDelta = new List<int>();
    public List<int> finalDeltaAveragesGroupedByDay = new List<int>();
    public List<int> overshotCoefficient = new List<int>();
    public Dictionary<DateTime, List<int>> finalDeltaGroupedByDay = new Dictionary<DateTime, List<int>>();
}

public class DataGetterReasoning : MonoBehaviour
{
    public ReasoningDataLists ReasoningData = new ReasoningDataLists();
    public Dictionary<string, ReasoningDataLists> allPlayersData = new Dictionary<string, ReasoningDataLists>();
    // private DatabaseReference reference;
    public float percentile;
    public float averageDesiredDeltaOfPlayer;
    public List<float> finalDeltaAllUsers;
    // private FirebaseAuth auth;

    private void Awake()
    {
        // reference = FirebaseDatabase.DefaultInstance.RootReference;
        // auth = FirebaseAuth.DefaultInstance;
    }

    /*
     * This method is used for getting the data from the database for the Reasoning game.
     * The type parameter is used to specify which data should be retrieved.
     */
    public void GetPlayerData(String type)
    {
        // string userId = auth.CurrentUser.UserId;
        // reference.Child("users").Child(userId)
        //     .OrderByKey()
        //     .GetValueAsync().ContinueWithOnMainThread(task =>
        //     {
        //         if (task.IsFaulted)
        //         {
        //             Debug.LogError(task.Exception);
        //         }
        //         else if (task.IsCompleted)
        //         {
        //             DataSnapshot snapshot = task.Result;
        //             if (type == "desiredAmount")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry = JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         ReasoningData.desiredAmount.Add(entry.desiredAmount);   
        //                     }
        //                 }   
        //             }
        //             else if (type == "level")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry =
        //                             JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         ReasoningData.level.Add(entry.level);
        //                     }
        //                 }
        //             }
        //             else if (type == "desiredFinalDelta")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry =
        //                             JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         ReasoningData.desiredFinalDelta.Add(entry.desiredFinalDelta);
        //                     }
        //                 }
        //                 CountAverageOfTimeLasted();
        //                 LogStatisticsEvents.DataRetrievedDesiredFinalDelta();
        //             }
        //             else if (type == "finalAmount")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry =
        //                             JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         ReasoningData.finalAmount.Add(entry.finalAmount);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedFinalAmount();
        //             }
        //             else if (type == "overshotCoefficient")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry =
        //                             JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         ReasoningData.overshotCoefficient.Add(entry.overshotCoefficient);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedOvershotCoefficient();
        //             }
        //             else if(type == "finalDeltaGroupedByDay")
        //             {
        //                 try
        //                 {
        //                     foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                     {
        //                         if (childSnapshot.HasChild("GameType") &&
        //                             childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                         {
        //                             DataToSaveReasoning entry = JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                             DateTime dateWithTime = DateTime.Parse(entry.date);
        //                             DateTime date = dateWithTime.Date;
        //                             if (ReasoningData.finalDeltaGroupedByDay.ContainsKey(date))
        //                             {
        //                                 ReasoningData.finalDeltaGroupedByDay[date].Add(entry.desiredFinalDelta);
        //                             }
        //                             else
        //                             {
        //                                 ReasoningData.finalDeltaGroupedByDay.Add(date, new List<int> {entry.desiredFinalDelta});
        //                             }
        //                         }
        //                     }
        //                 }
        //                 catch (Exception ex)
        //                 {
        //                     throw;
        //                 }
        //                 LogStatisticsEvents.DataRetrievedFinalDeltaGrouped();
        //             }
        //         }
        //     });
    }
    
    public void CalculateAverageOfGroupedFinalDeltas()
    {
        foreach (var date in ReasoningData.finalDeltaGroupedByDay.Keys)
        {
            int sum = 0;
            foreach (var time in ReasoningData.finalDeltaGroupedByDay[date])
            {
                sum = sum + time;
            }
            int average = sum / ReasoningData.finalDeltaGroupedByDay[date].Count;
            ReasoningData.finalDeltaAveragesGroupedByDay.Add(average);
        }
    }

    public void GetAllPlayerAverages()
    {
        // reference.Child("users")
        //     .GetValueAsync().ContinueWithOnMainThread(task =>
        //     {
        //         if (task.IsFaulted)
        //         {
        //             Debug.LogError(task.Exception);
        //         }
        //         else if (task.IsCompleted)
        //         {
        //             DataSnapshot snapshot = task.Result;
        //             finalDeltaAllUsers.Clear();
        //
        //             foreach (DataSnapshot userSnapshot in snapshot.Children)
        //             {
        //                 float total = 0;
        //                 int count = 0;
        //
        //                 foreach (DataSnapshot childSnapshot in userSnapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "Reasoning")
        //                     {
        //                         DataToSaveReasoning entry = JsonUtility.FromJson<DataToSaveReasoning>(childSnapshot.GetRawJsonValue());
        //                         total += Math.Abs(entry.desiredFinalDelta);
        //                         count++;
        //                     }
        //                 }
        //
        //                 if (count > 0)
        //                 {
        //                     float average = total / count;
        //                     finalDeltaAllUsers.Add(average);
        //                 }
        //             }
        //             CalculateUserPercentile();
        //             LogStatisticsEvents.AllDataRetrievedFinalDelta();
        //         }
        //     });
        // 
    }
    
    public void CountAverageOfTimeLasted()
    {
        float sum = 0;
        foreach (var finalDelta in ReasoningData.desiredFinalDelta)
        {
            
            sum = sum + Math.Abs(finalDelta);
        }
        averageDesiredDeltaOfPlayer = sum / ReasoningData.desiredFinalDelta.Count;
    }

    public Tuple<int,int> CalculateRank()
    {
        int rank = 1;
        foreach (var average in finalDeltaAllUsers)
        {
            if (average < averageDesiredDeltaOfPlayer)
            {
                rank++;
            }
        }

        return new Tuple<int, int>(rank, finalDeltaAllUsers.Count);
    }

    public void CalculateUserPercentile()
    {
        int numUsersBelow = CalculateUsersBelowMyAverage();
        int totalUsers = finalDeltaAllUsers.Count;
        if (numUsersBelow == 0)
        {
            percentile = 0;
            return;
        }
        if (numUsersBelow == totalUsers - 1)
        {
            percentile = 100;
            return;
        }
        percentile = (float)numUsersBelow / totalUsers * 100;
    }

    public int CalculateUsersBelowMyAverage()
    {
        int numUsersBelow = 0;
        finalDeltaAllUsers.Sort();
        foreach (var average in finalDeltaAllUsers)
        {
            if(average > averageDesiredDeltaOfPlayer)
            {
                numUsersBelow++;
            }
        }
        return numUsersBelow;
    }

}
