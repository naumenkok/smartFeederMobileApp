using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class GetWaterLevelInBowl : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public SpriteRenderer spriteRenderer;
    public float maxWaterLevel = 420f;
    public float fillLevel = 0f;
    public float updateIntervalInSeconds = 2f;
    public Transform waterTransform;
    private Vector3 initialScale;
    private Vector3 initialPosition;

    private void Start()
    {
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
                newScale.y *= fillLevel;
                waterTransform.localScale = newScale;

                Vector3 newPosition = initialPosition;
                newPosition.y = initialPosition.y - (initialScale.y - newScale.y) / 2f;
                waterTransform.localPosition = newPosition;
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
