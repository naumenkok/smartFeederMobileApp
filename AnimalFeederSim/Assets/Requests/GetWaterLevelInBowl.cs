using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class GetWaterLevelInBowl : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public string closeWaterURL = "http://localhost:8080/closeWater";
    public Transform waterTransform;
    public float maxWaterLevel = 420f;
    public float fillLevel = 0f;
    public float updateIntervalInSeconds = 2f;
    private Vector3 initialScale;
    private Vector3 initialPosition;

    private void Start()
    {
        initialScale = waterTransform.localScale;
        initialPosition = waterTransform.localPosition;
        StartCoroutine(UpdateWaterLevel());
    }

    private IEnumerator UpdateWaterLevel()
    {
        while (true)
        {
            UnityWebRequest request = UnityWebRequest.Get(endpointURL);
            yield return request.SendWebRequest();
            Debug.Log("Getting Water level in bowl successful");

            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;
                WaterLevelData data = JsonUtility.FromJson<WaterLevelData>(response);
                float bowlWaterLevel = data.water;
                fillLevel = bowlWaterLevel / maxWaterLevel;

                Vector3 newScale = initialScale;
                newScale.y = fillLevel * initialScale.y;
                waterTransform.localScale = newScale;

                Vector3 newPosition = initialPosition;
                newPosition.y = initialPosition.y - (initialScale.y - newScale.y) / 2f;
                waterTransform.localPosition = newPosition;

                if (fillLevel >= 1f)
                {
                    UnityWebRequest closeWaterrequest = UnityWebRequest.Post(closeWaterURL, "");
                    yield return closeWaterrequest.SendWebRequest();
                    if (closeWaterrequest.result == UnityWebRequest.Result.Success)
                    {
                        Debug.Log("Water valve closed");
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
public class WaterLevelData
{
    public float water;
}
