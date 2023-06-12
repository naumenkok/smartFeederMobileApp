using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class CheckIfFoodValveOpen : MonoBehaviour
{
    public string valveStatusURL = "http://localhost:8080/getValveStatus";
    public string removeContainerFoodURL = "http://localhost:8080/removeContainerFood";
    public string addBowlFoodURL = "http://localhost:8080/addBowlFood";
    public int amountOfFood = 10;
    public float updateIntervalInSeconds = 2f;

    private void Start()
    {
        StartCoroutine(ChangeFoodLevels());
    }

    private IEnumerator ChangeFoodLevels()
    {
        while (true)
        {

            UnityWebRequest requestValves = UnityWebRequest.Get(valveStatusURL);
            yield return requestValves.SendWebRequest();
            if (requestValves.result == UnityWebRequest.Result.Success)
            {
                string response = requestValves.downloadHandler.text;
                ValveFoodStatusData data = JsonUtility.FromJson<ValveFoodStatusData>(response);

                if (data.foodOpen)
                {
                    UnityWebRequest removeContainerFoodRequest = UnityWebRequest.Post(removeContainerFoodURL + "?amount=" + amountOfFood.ToString(), "");
                    UnityWebRequest addFoodRequest = UnityWebRequest.Post(addBowlFoodURL + "?amount=" + amountOfFood.ToString(), "");

                    yield return removeContainerFoodRequest.SendWebRequest();
                    yield return addFoodRequest.SendWebRequest();

                    if (removeContainerFoodRequest.result == UnityWebRequest.Result.Success && addFoodRequest.result == UnityWebRequest.Result.Success)
                    {
                        Debug.Log("Filling food was successful");
                    }
                }
            }
            yield return new WaitForSeconds(updateIntervalInSeconds);

        }
    }
}

[System.Serializable]
public class ValveFoodStatusData
{
    public bool foodOpen;

}
