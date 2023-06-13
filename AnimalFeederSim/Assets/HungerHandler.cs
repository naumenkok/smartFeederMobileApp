using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;
using TMPro;

public class HungerHandler : MonoBehaviour
{
    public TextMeshProUGUI ThirstLevelText;
    public TextMeshProUGUI HungerLevelText;

    public TimeHandler TimeHandlerRef;
    public float FoodInStomachPercentage = 100f;
    public float WaterInStomachPercentage = 100f;

    public float FoodDeclineRate = 0.1f;

    public float WaterDeclineRate = 0.2f;
    void Start()
    {
        ThirstLevelText.text = "Thirst Level: " + WaterInStomachPercentage.ToString("F1") + "%";
        HungerLevelText.text = "Hunger Level: " + FoodInStomachPercentage.ToString("F1") + "%";

        StartCoroutine(DecreaseLevelsRoutine());
    }
    IEnumerator DecreaseLevelsRoutine()
    {
        while (true)
        {
            yield return new WaitForSeconds(TimeHandlerRef.secondsPerGameHour/60);

            FoodInStomachPercentage -= FoodDeclineRate;
            WaterInStomachPercentage -= WaterDeclineRate;
            if (FoodInStomachPercentage < 0)
            {
                FoodInStomachPercentage = 0;
            }

            if (WaterInStomachPercentage < 0)
            {
                WaterInStomachPercentage = 0;
            }
            ThirstLevelText.text = "Thirst Level: " + WaterInStomachPercentage.ToString("F1") + "%";
            HungerLevelText.text = "Hunger Level: " + FoodInStomachPercentage.ToString("F1") + "%";
        }
    }
}
