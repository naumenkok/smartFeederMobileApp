using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

public class AnimalMovement : MonoBehaviour
{
    public float moveSpeed = 3f;
    public float moveRange = 20f;
    private bool facingRight = true;
    private bool isEating = false;
    private bool isWaiting = false;

    public HungerHandler hungerHandlerRef;
    private GetFoodLevelInBowl foodLevelInBowlRef;
    private GetWaterLevelInBowl waterLevelInBowlRef;
    private Animator animator;
    private float leftWaterBound;
    private float rightWaterBound;
    private float leftFoodBound;
    private float rightFoodBound;

    private float leftDoorBound;
    private float rightDoorBound;
    private Vector3 moveDirection;

    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();
        GameObject foodBowlObject = GameObject.Find("food bowl");
        GameObject waterBowlObject = GameObject.Find("water bowl");
        GameObject DoorLeft = GameObject.Find("DoorLeft");
        GameObject DoorRight = GameObject.Find("DoorRight");
        var foodBowlRenderer = foodBowlObject.GetComponent<Renderer>();
        var waterBowlRenderer = waterBowlObject.GetComponent<Renderer>();
        foodLevelInBowlRef = FindObjectOfType<GetFoodLevelInBowl>();
        waterLevelInBowlRef = FindObjectOfType<GetWaterLevelInBowl>();
        float randomX = Random.Range(-moveRange, moveRange);
        transform.position = new Vector2(randomX, transform.position.y);

        Vector3 foodBowlSize = foodBowlObject.transform.localScale;
        Vector3 foodBowlPosition = foodBowlObject.transform.position;
        leftFoodBound = foodBowlPosition.x - foodBowlSize.x / 2f;
        rightFoodBound = foodBowlPosition.x + foodBowlSize.x / 2f;

        Vector3 waterBowlSize = waterBowlObject.transform.localScale;
        Vector3 waterBowlPosition = waterBowlObject.transform.position;
        leftWaterBound = waterBowlPosition.x - waterBowlSize.x / 2f;
        rightWaterBound = waterBowlPosition.x + waterBowlSize.x / 2f;

        leftDoorBound = DoorLeft.transform.position.x;
        rightDoorBound =  DoorRight.transform.position.x;
        animator.SetBool("isEating", false);
        animator.SetBool("isMoving", true);

    }

    // Update is called once per frame
    void Update()
    {
        var waterLevel = waterLevelInBowlRef.fillLevel;
        var foodLevel = foodLevelInBowlRef.fillLevel;
        if (transform.position.x >= moveRange && facingRight)
        {
            Flip();
        }
        else if (transform.position.x <= -moveRange && !facingRight)
        {
            Flip();
        }

        if ((hungerHandlerRef.FoodInStomachPercentage < 15 && foodLevel <= 0) ||
            (hungerHandlerRef.WaterInStomachPercentage < 15 && waterLevel <= 0))
        {
            animator.Play("pig_cry");
            return;
        }

        if ((foodLevel <= 0 || hungerHandlerRef.FoodInStomachPercentage > 93)
            && (waterLevel <= 0 || hungerHandlerRef.WaterInStomachPercentage > 93) && !isEating && !isWaiting)
        {
            float moveDirection = facingRight ? 1 : -1;
            transform.Translate(moveDirection * moveSpeed * Time.deltaTime, 0, 0);
            isEating = false;
            animator.SetBool("isEating", false);
            animator.SetBool("isDrinking", false);
            animator.SetBool("isMoving", true);
        }
        else
        {
            if (!isEating && !isWaiting)
            {
                if (hungerHandlerRef.FoodInStomachPercentage < hungerHandlerRef.WaterInStomachPercentage)
                {
                    bool moveDirectionToBowlRight = transform.position.x < leftFoodBound;
                    if ((moveDirectionToBowlRight && !facingRight) || (!moveDirectionToBowlRight && facingRight))
                    {
                        Flip();
                    }
                    float moveDirection = facingRight ? 1 : -1;
                    transform.Translate(moveDirection * moveSpeed * Time.deltaTime, 0, 0);
                    if (transform.position.x >= leftFoodBound && transform.position.x <= rightFoodBound)
                    {
                        if (!isEating)
                        {
                            StartCoroutine(EatFoodOverTime(1f));
                        }
                    }
                }
                else
                {
                    bool moveDirectionToBowlRight = transform.position.x < leftWaterBound;
                    if ((moveDirectionToBowlRight && !facingRight) || (!moveDirectionToBowlRight && facingRight))
                    {
                        Flip();
                    }
                    float moveDirection = facingRight ? 1 : -1;
                    transform.Translate(moveDirection * moveSpeed * Time.deltaTime, 0, 0);
                    if (transform.position.x >= leftWaterBound && transform.position.x <= rightWaterBound)
                    {
                        if (!isEating)
                        {
                            StartCoroutine(DrinkWaterOverTime(1f));
                        }
                    }
                }
            }
        }
        

        void Flip()
        {
            facingRight = !facingRight;
            Vector3 flipped = transform.localScale;
            flipped.x *= -1;
            transform.localScale = flipped;

        }

        IEnumerator EatFoodOverTime(float interval)
        {
            isEating = true;
            animator.SetBool("isEating", true);
            animator.SetBool("isMoving", false);

            while (foodLevelInBowlRef.fillLevel > 0 && hungerHandlerRef.FoodInStomachPercentage < 98)
            {
                StartCoroutine(PostEatFood(10));
                animator.Play("pig_eat");
                yield return new WaitForSeconds(interval);
            }
            isEating = false;
            animator.SetBool("isEating", false);
            animator.SetBool("isMoving", true);
            animator.Play("pig_idle");
            
            isWaiting = true;
            yield return new WaitForSeconds(2f);
            isWaiting = false;
        }
        
        IEnumerator DrinkWaterOverTime(float interval)
        {
            isEating = true;
            animator.SetBool("isMoving", false);
            animator.SetBool("isDrinking", true);

            while (waterLevelInBowlRef.fillLevel > 0 && hungerHandlerRef.WaterInStomachPercentage < 98)
            {
                StartCoroutine(PostDrinkWater(10));
                animator.Play("pig_drink");
                yield return new WaitForSeconds(interval);
            }
            isEating = false;
            animator.SetBool("isDrinking", false);
            animator.SetBool("isMoving", true);
            animator.Play("pig_idle");
            
            isWaiting = true;
            yield return new WaitForSeconds(2f);
            isWaiting = false;
        }

        IEnumerator PostEatFood(int amount)
        {
            string url = "http://localhost:8080/removeBowlFood?amount=" + amount;
            UnityWebRequest request = UnityWebRequest.Post(url, "");
            hungerHandlerRef.FoodInStomachPercentage += 1;
            if (hungerHandlerRef.FoodInStomachPercentage >= 100)
            {
                hungerHandlerRef.FoodInStomachPercentage = 100;
            }
            yield return request.SendWebRequest();
        }
        
        IEnumerator PostDrinkWater(int amount)
        {
            string url = "http://localhost:8080/removeBowlWater?amount=" + amount;
            UnityWebRequest request = UnityWebRequest.Post(url, "");
            hungerHandlerRef.WaterInStomachPercentage += 1;
            if (hungerHandlerRef.WaterInStomachPercentage >= 100)
            {
                hungerHandlerRef.WaterInStomachPercentage = 100;
            }
            yield return request.SendWebRequest();
        }
    }
}