using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class RefillFood : MonoBehaviour
{
    // Start is called before the first frame update
    public Button button;
    private string serverURL = "http://localhost:8080/addContainerFood";
    public string getURL = "http://localhost:8080/getSimStatus";
    public int amountOfFood = 300;
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
            ContainerFoodLevelData data = JsonUtility.FromJson<ContainerFoodLevelData>(response);
            float containerFoodLevel = data.containerFood;
            int amountToAdd = amountOfFood;
            if ((int)containerFoodLevel + amountToAdd > maximumContainerCapacity)
            {
                amountToAdd = maximumContainerCapacity - (int)containerFoodLevel;
            }
            UnityWebRequest request = UnityWebRequest.Post(serverURL + "?amount=" + amountToAdd.ToString(), "");
            yield return request.SendWebRequest();
        }
    }
}
