using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class GetWaterLevelInContainer : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public SpriteRenderer spriteRenderer;
    public Transform waterTransform;
    public float maxWaterLevel = 2000f;
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
            Debug.Log("Getting Water level in container successful");
            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;

                ContainerWaterLevelData data = JsonUtility.FromJson<ContainerWaterLevelData>(response);

                float containerWaterLevel = data.containerWater;

                fillLevel = containerWaterLevel / maxWaterLevel;

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
public class ContainerWaterLevelData
{
    public float containerWater;
}