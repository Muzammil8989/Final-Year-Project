# resume_extraction.py

import re
import spacy
from pdfminer.high_level import extract_text
from spacy.matcher import Matcher
import logging
from db import skills_collection  

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load spaCy model and initialize Matcher
nlp = spacy.load('en_core_web_sm')
matcher = Matcher(nlp.vocab)

# Predefined patterns for name extraction
name_patterns = [
    [{'POS': 'PROPN'}, {'POS': 'PROPN'}],  # First name and Last name
    [{'POS': 'PROPN'}, {'POS': 'PROPN'}, {'POS': 'PROPN'}],  # First, Middle, Last
    [{'POS': 'PROPN'}, {'POS': 'PROPN'}, {'POS': 'PROPN'}, {'POS': 'PROPN'}]  # Extended names
]

# Add name patterns to matcher
for pattern in name_patterns:
    matcher.add('NAME', [pattern])

def extract_text_from_pdf(file):
    try:
        file.seek(0)  # Ensure reading from the beginning
        text = extract_text(file)
        logger.info("PDF text extraction successful.")
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_name(resume_text):
    doc = nlp(resume_text)
    matches = matcher(doc)
    for match_id, start, end in matches:
        span = doc[start:end]
        logger.debug(f"Name extracted using matcher: {span.text}")
        return span.text
    # Fallback to first PERSON entity if matcher fails
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            logger.debug(f"Name extracted using NER: {ent.text}")
            return ent.text
    logger.warning("No name found.")
    return None

def extract_contact_number_from_resume(text):
    pattern = r"""
        (?:(?:\+?\d{1,3})[-.\s]?)?
        (?:(?:\(?\d{3}\)?)[-.\s]?)?
        \d{3}
        [-.\s]?
        \d{4}
    """
    regex = re.compile(pattern, re.VERBOSE | re.IGNORECASE)
    matches = regex.finditer(text)
    
    for match in matches:
        contact = match.group()
        clean_contact = re.sub(r"[^\d+]", "", contact)
        digits_only = re.sub(r"[^\d]", "", clean_contact)
        if len(digits_only) >= 10:
            logger.debug(f"Contact number extracted: {clean_contact}")
            return clean_contact
    logger.warning("No contact number found.")
    return None

def extract_email_from_resume(text):
    pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    matches = re.findall(pattern, text)
    if matches:
        email = matches[0]
        logger.debug(f"Email extracted: {email}")
        return email
    logger.warning("No email found.")
    return None

def extract_linkedin_profile(text):
    pattern = r"(?:https?://)?(?:www\.)?linkedin\.com/(?:in|pub)/[A-Za-z0-9_-]+/?(?:[A-Za-z0-9_-]+)?"
    matches = re.findall(pattern, text, re.IGNORECASE)
    if matches:
        linkedin = matches[0]
        if not linkedin.startswith("http"):
            linkedin = "https://" + linkedin
        logger.debug(f"LinkedIn profile extracted: {linkedin}")
        return linkedin
    logger.warning("No LinkedIn profile found.")
    return None

def extract_skills_from_resume(text, skills_list):
    skills = set()
    for skill in skills_list:
        pattern = r"\b{}\b".format(re.escape(skill))
        if re.search(pattern, text, re.IGNORECASE):
            skills.add(skill)
    logger.debug(f"Skills extracted: {skills}")
    return list(skills)

def extract_education_from_resume(text):
    education_keywords = [
        "Bachelor", "B.Sc", "B.S.", "B.A.", "B.Eng.", "B.Tech",
        "Master", "M.Sc", "M.S.", "M.A.", "M.Eng.", "M.Tech",
        "Ph.D", "Doctorate", "High School", "Diploma",
        "Degree", "Certification", "Graduate", "Postgraduate", "Undergraduate"
    ]
    pattern = r"(?i)\b(?:{})\b.*?(?=\n|$|[.;])".format("|".join(education_keywords))
    matches = re.findall(pattern, text)
    education = [match.strip() for match in matches]
    logger.debug(f"Education extracted: {education}")
    return education

def extract_colleges_from_resume(text):
    colleges = set()
    pattern = r"([A-Z][^\s,.]+[.]?\s)*(College|University|Institute|Law School|School of|Academy)[^,\d]*(?=,|\d)"
    matches = re.findall(pattern, text, re.IGNORECASE)
    
    for match in matches:
        college_name = " ".join(part.strip() for part in match if part).strip()
        if college_name:
            colleges.add(college_name)
    logger.debug(f"Colleges extracted: {colleges}")
    return list(colleges)

def extract_work_experience(text):
    experience_keywords = ["Experience", "Work Experience", "Professional Experience"]
    pattern = r"(?i)(" + "|".join(experience_keywords) + r").*?(?=\n\n|\Z)"
    match = re.search(pattern, text, re.DOTALL)
    if match:
        work_exp = match.group().strip()
        logger.debug(f"Work experience extracted: {work_exp}")
        return work_exp
    logger.warning("No work experience found.")
    return None

def extract_certifications(text):
    certification_keywords = ["Certification", "Certifications", "Certified", "Certification in"]
    pattern = r"(?i)(" + "|".join(certification_keywords) + r").*?(?=\n\n|\Z)"
    matches = re.findall(pattern, text, re.DOTALL)
    certifications = [match.strip() for match in matches]
    if certifications:
        logger.debug(f"Certifications extracted: {certifications}")
        return certifications
    logger.warning("No certifications found.")
    return None

def extract_address(text):
    street_pattern = r'\d{1,5}\s(?:\w+\s){1,4}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Lane|Ln|Drive|Dr|Court|Ct)\,?\s\w+\,?\s\w{2}\s\d{5}'
    match = re.search(street_pattern, text)
    if match:
        address = match.group().strip()
        logger.debug(f"Address extracted (street): {address}")
        return address
    
    city_country_pattern = r"\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\s*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b"
    match = re.search(city_country_pattern, text)
    if match:
        address = match.group().strip()
        logger.debug(f"Address extracted (city, country): {address}")
        return address
    
    doc = nlp(text)
    gpes = [ent.text for ent in doc.ents if ent.label_ == 'GPE']
    if gpes:
        if len(gpes) >= 2:
            address = ', '.join(gpes[:2])
        else:
            address = gpes[0]
        logger.debug(f"Address extracted using NER: {address}")
        return address
    
    logger.warning("No address found.")
    return None
