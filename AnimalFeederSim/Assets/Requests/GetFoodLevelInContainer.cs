using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class GetFoodLevelInContainer : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public SpriteRenderer spriteRenderer;
    public Transform foodTransform;
    public float maxFoodLevel = 2000f;
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
            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;

                ContainerFoodLevelData data = JsonUtility.FromJson<ContainerFoodLevelData>(response);

                float containerFoodLevel = data.containerFood;

                fillLevel = containerFoodLevel / maxFoodLevel;

                Vector3 newScale = initialScale;
                newScale.y *= fillLevel;
                foodTransform.localScale = newScale;

                Vector3 newPosition = initialPosition;
                newPosition.y = initialPosition.y - (initialScale.y - newScale.y) / 2f;
                foodTransform.localPosition = newPosition;
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
public class ContainerFoodLevelData
{
    public float containerFood;
}

