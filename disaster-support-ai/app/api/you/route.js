import { sentences } from "sbd";
import {NextResponse} from 'next/server' 


async function fetchAndFilterNews(userQuery) {
    const encodedQuery = encodeURIComponent(userQuery);
    console.log("Encoded query:", encodedQuery);
    const url = `https://api.ydc-index.io/news?query=${encodedQuery}`;
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": process.env.NEXT_PUBLIC_API_KEY,
        },
    };

    try {
        const response = await fetch(url, options);
        console.log("Response:", response);

        // Check for response status
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Parsed JSON data:", data);
        const results = data.news?.results || [];
        results.forEach((result, index) => {
            console.log(`Result ${index + 1}:`, result);
          });
          const firstFourResults = results.slice(0, 3);

  // Log each of the first 4 results
  
  const urls = firstFourResults.map(result => result.url);
        // Extract and map the required fields
       

    return urls;
        
        
        
    } catch (err) {
        console.error("Error fetching and filtering news:", err);
        return [];
    }
}

// API route handler
export async function POST(req) {
    console.log("POST request received");  
    try {
        const { searchTerms } = await req.json(); 
        // Parse the JSON body of the incoming request
        console.log("Received searchTerms:", searchTerms);
        const data = await fetchAndFilterNews(searchTerms); // Fetch and filter the news

        // Return the filtered news data as a JSON response
        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error handling POST request:", error);
        // Return an error response with a 500 status code
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}