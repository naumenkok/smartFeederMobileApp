using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;
public class OpenWater : MonoBehaviour
{
    public Button button;
    private string serverURL = "http://localhost:8080/openWater";
    // Start is called before the first frame update
    void Start()
    {
        button.onClick.AddListener(OnButtonClick);
    }

    private void OnButtonClick()
    {
        StartCoroutine(SendRequest());
    }
    
    // Update is called once per frame
    private IEnumerator SendRequest()
    {
        UnityWebRequest request = UnityWebRequest.Post(serverURL, "");
        yield return request.SendWebRequest();

        if (request.result == UnityWebRequest.Result.Success)
        {
            Debug.Log("Post request successful");
        }
        else
        {
            Debug.LogError("Post request failed: " + request.error);
        }
    }
}
