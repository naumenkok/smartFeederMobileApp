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
    private GetFoodLevelInBowl foodLevelInBowlRef;
    private GetWaterLevelInBowl waterLevelInBowlRef;
    private Animator animator;
    private float leftWaterBound;
    private float rightWaterBound;
    private float leftFoodBound;
    private float rightFoodBound;
    private Vector3 moveDirection;
    // Start is called before the first frame update
    void Start()
    {
        animator = GetComponent<Animator>();
        GameObject foodBowlObject = GameObject.Find("food bowl");
        GameObject waterBowlObject = GameObject.Find("water bowl");
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
        if (foodLevel <= 0)
        {
            float moveDirection = facingRight ? 1 : -1;
            transform.Translate(moveDirection * moveSpeed * Time.deltaTime, 0, 0);
            isEating = false;
            animator.SetBool("isEating", false);
            animator.SetBool("isMoving", true);
        }
        else
        {
            if (!isEating)
            {
                float moveDirectionToBowl = (rightFoodBound - leftFoodBound > 0) ? 1 : -1;
                transform.Translate(moveDirectionToBowl * moveSpeed * Time.deltaTime, 0, 0);
            }
            if (transform.position.x >= leftFoodBound && transform.position.x <= rightFoodBound)
            {
                isEating = true;
                StartCoroutine(RemoveFoodOverTime(1f));
                animator.SetBool("isEating", true);
                animator.SetBool("isMoving", false);
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
    IEnumerator RemoveFoodOverTime(float interval)
    {
        while (true)
        {
            StartCoroutine(PostEatFood(10));

            yield return new WaitForSeconds(interval);
        }
    }
    
    IEnumerator PostEatFood(int amount)
    {
        string url = "http://localhost:8080/removeBowlFood?amount=" + amount;
        UnityWebRequest request = UnityWebRequest.Post(url, "");
        yield return request.SendWebRequest();
    }
}