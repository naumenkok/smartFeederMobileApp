using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;


public class GetFoodLevelInBowl : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public string closeFoodURL = "http://localhost:8080/closeFood";
    public Transform foodTransform;
    public float maxFoodLevel = 420f;
    public float fillLevel = 0f;
    public float updateIntervalInSeconds = 2f;
    private Vector3 initialScale;
    private Vector3 initialPosition;

    private void Start()
    {
        initialScale = foodTransform.localScale;
        initialPosition = foodTransform.localPosition;
        StartCoroutine(UpdateFoodLevel());
    }

    private IEnumerator UpdateFoodLevel()
    {
        while (true)
        {
            UnityWebRequest request = UnityWebRequest.Get(endpointURL);
            yield return request.SendWebRequest();
            Debug.Log("Getting Food level in bowl successful");

            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;
                FoodLevelData data = JsonUtility.FromJson<FoodLevelData>(response);
                float bowlFoodLevel = data.food;
                fillLevel = bowlFoodLevel / maxFoodLevel;

                Vector3 newScale = initialScale;
                newScale.y = fillLevel * initialScale.y;
                foodTransform.localScale = newScale;

                Vector3 newPosition = initialPosition;
                newPosition.y = initialPosition.y - (initialScale.y - newScale.y) / 2f;
                foodTransform.localPosition = newPosition;

                if (fillLevel >= 1f)
                {
                    UnityWebRequest closeFoodrequest = UnityWebRequest.Post(closeFoodURL, "");
                    yield return closeFoodrequest.SendWebRequest();
                    if (closeFoodrequest.result == UnityWebRequest.Result.Success)
                    {
                        Debug.Log("Food valve closed");
                    }
                }
            }
            else
            {
                Debug.LogError(request.error);
            }

            yield return new WaitForSeconds(updateIntervalInSeconds);
        }
    }
}
[System.Serializable]
public class FoodLevelData
{
    public float food;
}
