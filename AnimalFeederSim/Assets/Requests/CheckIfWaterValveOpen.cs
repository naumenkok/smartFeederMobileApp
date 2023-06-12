using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CheckIfWaterValveOpen : MonoBehaviour
{
    public string valveStatusURL = "http://localhost:8080/getValveStatus";
    public string removeContainerWaterURL = "http://localhost:8080/removeContainerWater";
    public string addBowlWaterURL = "http://localhost:8080/addBowlWater";
    public int amountOfWater = 20;
    public float updateIntervalInSeconds = 2f;

    private void Start()
    {
        StartCoroutine(ChangeWaterLevels());
    }

    private IEnumerator ChangeWaterLevels()
    {
        while (true)
        {

            UnityWebRequest requestValves = UnityWebRequest.Get(valveStatusURL);
            yield return requestValves.SendWebRequest();

            if (requestValves.result == UnityWebRequest.Result.Success)
            {
                string response = requestValves.downloadHandler.text;
                ValveWaterStatusData data = JsonUtility.FromJson<ValveWaterStatusData>(response);

                if (data.waterOpen)
                {
                    UnityWebRequest removeContainerWaterRequest = UnityWebRequest.Post(removeContainerWaterURL + "?amount=" + amountOfWater.ToString(), "");
                    UnityWebRequest addWaterRequest = UnityWebRequest.Post(addBowlWaterURL + "?amount=" + amountOfWater.ToString(), "");

                    yield return removeContainerWaterRequest.SendWebRequest();
                    yield return addWaterRequest.SendWebRequest();

                    if (removeContainerWaterRequest.result == UnityWebRequest.Result.Success && addWaterRequest.result == UnityWebRequest.Result.Success)
                    {
                        Debug.Log("Filling water was successful");
                    }
                }
            }
            yield return new WaitForSeconds(updateIntervalInSeconds);

        }
    }
}

[System.Serializable]
public class ValveWaterStatusData
{
    public bool waterOpen;
    
}