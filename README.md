# Holy_Sheet_REST_API
## What is HOLY_SHEET API?

```
This Api is basically made so that you can import you google sheets data as a JSON object.
And you can use this api for making you Google sheet as a database LOL 😂 a free database with world class User Interface.
```

## How to Use this API ?

```
First We have to make a Google sheet and make the link available for public.
```
![image](https://user-images.githubusercontent.com/79045059/123540963-4f771000-d75f-11eb-8392-dfcc919f1ad8.png)
```
Than We can Use 3 things to query for our data
1. Starting Row no eg-> A1
2. Ending Column no eg-> C5.
3. sheet id eg -> 
      https://docs.google.com/spreadsheets/d/ --> 1qZVTmeXVBjAxX2zDvaJ3VCz9wkm2PafdlDDN3jO22aQ  <-- /edit?usp=sharing
      this is Your sheet ID.
```
### This is the API link 👇🏻
https://holy-sheet-api.herokuapp.com/

```
You can Query 
https://holy-sheet-api.herokuapp.com/ {startingrow} / {endingcolumn} / {sheetid}
example ->  https://holy-sheet-api.herokuapp.com/A1/B3/1qZVTmeXVBjAxX2zDvaJ3VCz9wkm2PafdlDDN3jO22aQ
```
![image](https://user-images.githubusercontent.com/79045059/123541268-3ff8c680-d761-11eb-9319-c8467fde0d82.png)

This is data in JSON previewer 👇🏻
![image](https://user-images.githubusercontent.com/79045059/123541279-52730000-d761-11eb-8b2d-4751daa718ef.png)

