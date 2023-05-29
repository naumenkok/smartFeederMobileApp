using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class RefillWater : MonoBehaviour
{
    // Start is called before the first frame update
    public Button button;
    private string serverURL = "http://localhost:8080/addContainerWater";
    public string getURL = "http://localhost:8080/getSimStatus";
    public int amountOfWater = 300;
    public int maximumContainerCapacity = 2000;

    void Start()
    {
        button.onClick.AddListener(OnButtonClick);
    }

    private void OnButtonClick()
    {
        StartCoroutine(SendRequest());
    }
    
    private IEnumerator SendRequest()
    {
        UnityWebRequest getRequest = UnityWebRequest.Get(getURL);
        yield return getRequest.SendWebRequest();
        if (getRequest.result == UnityWebRequest.Result.Success)
        {
            string response = getRequest.downloadHandler.text;
            ContainerWaterLevelData data = JsonUtility.FromJson<ContainerWaterLevelData>(response);
            float containerWaterLevel = data.containerWater;
            int amountToAdd = amountOfWater;
            if ((int)containerWaterLevel + amountToAdd > maximumContainerCapacity)
            {
                amountToAdd = maximumContainerCapacity - (int)containerWaterLevel;
            }
            UnityWebRequest request = UnityWebRequest.Post(serverURL + "?amount=" + amountToAdd.ToString(), "");
            yield return request.SendWebRequest();
        }
    }
}
