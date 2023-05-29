using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;

public class CheckBatteryLevel : MonoBehaviour
{
    public string endpointURL = "http://localhost:8080/getSimStatus";
    public string addBatteryURL = "http://localhost:8080/addBatteryLevel";
    public string removeBatteryURL = "http://localhost:8080/removeBatteryLevel";
    public TextMeshProUGUI BatteryLevelText;
    public TextMeshProUGUI ChargingStatusText;
    public int amountOfPowerToAdd = 2;
    public int amountOfPowerToRemove = 1;
    private int currentBatteryPercentage;
    public bool ShouldChargeBattery = false;

    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(GetBatteryStatus());
        StartCoroutine(ChangeBatteryLevels());
    }

    // Update is called once per frame
    private IEnumerator GetBatteryStatus()
    {
        while (true)
        {
            UnityWebRequest request = UnityWebRequest.Get(endpointURL);
            yield return request.SendWebRequest();
            if (request.result == UnityWebRequest.Result.Success)
            {
                string response = request.downloadHandler.text;
                BatteryStatusData data = JsonUtility.FromJson<BatteryStatusData>(response);
                string batteryLevelString = data.battery.ToString();
                currentBatteryPercentage = (int)data.battery;
                bool isCharging = data.charging;
                ShouldChargeBattery = isCharging;
                if (BatteryLevelText != null)
                {
                    BatteryLevelText.text = $"Battery Level: {batteryLevelString}%";
                }
                if (ChargingStatusText != null)
                {
                    if (isCharging)
                    {
                        ChargingStatusText.text = "Device is plugged in";
                    }
                    else
                    {
                        ChargingStatusText.text = "Device is using battery power";
                    }
                }
            }
        }
    }
    private IEnumerator ChangeBatteryLevels()
    {
        while (true)
        {
            if(ShouldChargeBattery)
            {
                amountOfPowerToAdd = 2;
                if (amountOfPowerToAdd + currentBatteryPercentage > 100)
                {
                    amountOfPowerToAdd = 100 - currentBatteryPercentage;
                }
                UnityWebRequest request = UnityWebRequest.Post(addBatteryURL + "?amount=" + amountOfPowerToAdd.ToString(), "");
                yield return request.SendWebRequest();
                yield return new WaitForSeconds(2f);
            }
            else
            {
                amountOfPowerToRemove = 1;
                if (currentBatteryPercentage - amountOfPowerToRemove < 0)
                {
                    amountOfPowerToRemove = currentBatteryPercentage;
                }
                UnityWebRequest request = UnityWebRequest.Post(removeBatteryURL + "?amount=" + amountOfPowerToRemove.ToString(), "");
                yield return request.SendWebRequest();
                yield return new WaitForSeconds(2f);
            }
        }
    }
}

[System.Serializable]
public class BatteryStatusData
{
    public bool charging;
    public float battery;
}