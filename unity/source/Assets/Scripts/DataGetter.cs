// ------------------------------------------------------------------------
// DataGetter.cs
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
 * ReactionTimeLists class is used to store all the audio visual data from the database.
 */
public class ReactionTimeLists
{
    public List<float> reactionTimesTriangles = new List<float>();
    public List<float> reactionTimesSquares = new List<float>();
    public List<float> reactionTimesCircles = new List<float>();
    public List<float> reactionTimesDiamonds = new List<float>();
    public List<float> reactionTimesAudio = new List<float>();
    public List<float> timeLasted = new List<float>();
    public List<float> maxObjectCount = new List<float>();
    public List<float> timeLastedAveragesGroupedByDay = new List<float>();
    public Dictionary<DateTime, List<float>> timeLastedGroupedByDay = new Dictionary<DateTime, List<float>>();
}

public class DataGetter : MonoBehaviour
{
    public ReactionTimeLists reactionTimeLists = new ReactionTimeLists();
    public Dictionary<string, ReactionTimeLists> allPlayersData = new Dictionary<string, ReactionTimeLists>();
    // private DatabaseReference reference;
    // private FirebaseAuth auth;
    public float averageTimeLastedOfPlayer;
    public List<float> timeLastedAllUsers;
    public float percentile;

    private void Awake()
    {
        // reference = FirebaseDatabase.DefaultInstance.RootReference;
        // auth = FirebaseAuth.DefaultInstance;
        timeLastedAllUsers = new List<float>();
    }
    
    /*
     * GetPlayerData method is used to get the data of the player from the database.
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
        //             if (type == "triangles")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.reactionTimesTriangles.Add(entry.fastestReactionTimeTriangles);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedTriangles();
        //             }
        //             else if (type == "squares")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.reactionTimesSquares.Add(entry.fastestReactionTimeSquares);
        //                     }
        //                 }
        //
        //                 LogStatisticsEvents.DataRetrievedSquares();
        //             }
        //             else if (type == "circles")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.reactionTimesCircles.Add(entry.fastestReactionTimeCircles);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedCircles();
        //             }
        //             else if (type == "diamonds")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.reactionTimesDiamonds.Add(entry.fastestReactionTimeDiamond);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedDiamonds();
        //             }
        //             else if (type == "audio")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.reactionTimesAudio.Add(entry.fastestReactionTimeAudio);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedAudio();
        //             }
        //             else if (type == "timeLasted")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.timeLasted.Add(entry.timeLasted);
        //                     }
        //                 }   
        //                 CountAverageOfTimeLasted();
        //                 LogStatisticsEvents.DataRetrievedTimeLasted();
        //             }
        //             else if (type == "maxObjectCount")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         reactionTimeLists.maxObjectCount.Add(entry.maxObjectCount);
        //                     }
        //                 }   
        //                 LogStatisticsEvents.DataRetrievedMaxObjectCount();
        //             }
        //             else if(type == "timeLastedGroupedByDay")
        //             {
        //                 foreach (DataSnapshot childSnapshot in snapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         DateTime dateWithTime = DateTime.Parse(entry.date);
        //                         DateTime date = dateWithTime.Date;
        //                         if (reactionTimeLists.timeLastedGroupedByDay.ContainsKey(date))
        //                         {
        //                             reactionTimeLists.timeLastedGroupedByDay[date].Add(entry.timeLasted);
        //                         }
        //                         else
        //                         {
        //                             reactionTimeLists.timeLastedGroupedByDay.Add(date, new List<float> {entry.timeLasted});
        //                         }
        //                     }
        //                 }
        //                 LogStatisticsEvents.DataRetrievedTimeLastedGrouped();
        //             }
        //         }
        //     });
    }
    public void CalculateAverageOfGroupedTimes()
    {
        foreach (var date in reactionTimeLists.timeLastedGroupedByDay.Keys)
        {
            float sum = 0;
            foreach (var time in reactionTimeLists.timeLastedGroupedByDay[date])
            {
                sum = sum + time;
            }
            float average = sum / reactionTimeLists.timeLastedGroupedByDay[date].Count;
            reactionTimeLists.timeLastedAveragesGroupedByDay.Add(average);
        }
    }
    public void CreateListFromAverages()
    {
        foreach (var date in reactionTimeLists.timeLastedGroupedByDay.Keys)
        {
            reactionTimeLists.timeLastedAveragesGroupedByDay.Add(reactionTimeLists.timeLastedGroupedByDay[date][0]);
        }
        reactionTimeLists.timeLastedGroupedByDay.Clear();
        
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
        //             timeLastedAllUsers.Clear();
        //
        //             foreach (DataSnapshot userSnapshot in snapshot.Children)
        //             {
        //                 float total = 0;
        //                 int count = 0;
        //
        //                 foreach (DataSnapshot childSnapshot in userSnapshot.Children)
        //                 {
        //                     if (childSnapshot.HasChild("GameType") &&
        //                         childSnapshot.Child("GameType").Value.ToString() == "AV")
        //                     {
        //                         DataToSave entry = JsonUtility.FromJson<DataToSave>(childSnapshot.GetRawJsonValue());
        //                         total += entry.timeLasted;
        //                         count++;
        //                     }
        //                 }
        //
        //                 if (count > 0)
        //                 {
        //                     float average = total / count;
        //                     timeLastedAllUsers.Add(average);
        //                 }
        //             }
        //             CalculateUserPercentile();
        //             LogStatisticsEvents.AllDataRetrievedTimeLasted();
        //         }
        //     });
        // 
    }

    public void CountAverageOfTimeLasted()
    {
        float sum = 0;
        foreach (var time in reactionTimeLists.timeLasted)
        {
            sum = sum + time;
        }
        averageTimeLastedOfPlayer = sum / reactionTimeLists.timeLasted.Count;
    }
    
    public Tuple<int,int> CalculateRank()
    {
        int rank = 1;
        foreach (var average in timeLastedAllUsers)
        {
            if (average > averageTimeLastedOfPlayer)
            {
                rank++;
            }
        }

        return new Tuple<int, int>(rank, timeLastedAllUsers.Count);
    }

    public void CalculateUserPercentile()
    {
        int numUsersBelow = CalculateUsersBelowMyAverage();
        int totalUsers = timeLastedAllUsers.Count;
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
        timeLastedAllUsers.Sort();
        foreach (var average in timeLastedAllUsers)
        {
            if(average < averageTimeLastedOfPlayer)
            {
                numUsersBelow++;
            }
        }
        return numUsersBelow;
    }
    

}
