# import os
# from google import genai
# from google.genai import types
# from pydantic import BaseModel

# client = genai.Client(api_key=os.getenv("GENAI_API_KEY"))


# class BlogAnalysis(BaseModel):
#     sentiment_score: float
#     primary_emotion: str
#     risk_level: str
#     reflection: str
#     coping_suggestion: str


# def analyze_blog(content: str) -> dict:

#     response = client.models.generate_content(
#         model="gemini-2.5-flash",
#         contents=f"""
# You are a mental wellness assistant.

# Analyze this journal entry:{content}
# Provide the following in a JSON format:
# - sentiment_score: A float between -1 (very negative) and 1 (very positive
# - primary_emotion: The main emotion expressed in the journal (e.g., "sadness", "joy", "anger", etc.)
# - risk_level: "low", "medium", or "high" based on the content's indication of potential mental health risks
# - reflection: A brief reflection or insight based on the journal content
# - coping_suggestion: A personalized coping suggestion based on the analysis
# """,
#         config=types.GenerateContentConfig(
#             temperature=0.3,
#             response_mime_type="application/json",
#             response_schema=BlogAnalysis,
#         ),
#     )

#     return response.parsed.dict()



import os
from pydantic import BaseModel, Field

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser


# ---------------------------------------------------
# 1️⃣ Define Structured Schema
# ---------------------------------------------------

class BlogAnalysis(BaseModel):
    sentiment_score: float = Field(..., ge=-1, le=1)
    primary_emotion: str
    risk_level: str
    reflection: str
    coping_suggestion: str


# ---------------------------------------------------
# 2️⃣ Setup Gemini LLM
# ---------------------------------------------------

# Load API key from environment - support both GENAI_API_KEY and GOOGLE_API_KEY
api_key = os.getenv("GENAI_API_KEY") or os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError(
        "GENAI_API_KEY environment variable is not set. "
        "Please set it in your .env file or as an environment variable."
    )
os.environ["GOOGLE_API_KEY"] = api_key

llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.3
)


# ---------------------------------------------------
# 3️⃣ Setup Output Parser
# ---------------------------------------------------

parser = PydanticOutputParser(pydantic_object=BlogAnalysis)


# ---------------------------------------------------
# 4️⃣ Create Prompt Template
# ---------------------------------------------------

prompt = ChatPromptTemplate.from_template("""
You are a mental wellness assistant.

Analyze the following journal entry:

{content}

Provide the response strictly in this JSON format:
{format_instructions}
""")


# ---------------------------------------------------
# 5️⃣ Build Chain
# ---------------------------------------------------

chain = prompt | llm | parser

# ---------------------------------------------------
# 6️⃣ Main Function (Used in Celery)
# ---------------------------------------------------

def analyze_blog(content: str) -> dict:
    result = chain.invoke({
        "content": content,
        "format_instructions": parser.get_format_instructions(),
    })

    return result.dict()