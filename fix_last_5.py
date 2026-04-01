import re

with open('lib/i18n/translations.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Remaining 5 languages
replacements = [
    # Gujarati
    (
        r"(gu: \{.*?'testimonials\.subtitle': '[^']*',)\n+(\s*\}),",
        r"\1,\n    'footer.product': 'પણ્ય',\n    'footer.productFeatures': 'લક्ષણો',\n    'footer.productHowItWorks': 'તે કેવી રીતે કાર્ય કરે છે',\n    'footer.productTestimonials': 'પ્રશંસાપત્ર',\n    'footer.productFAQ': 'FAQ',\n    'footer.company': 'કંપની',\n    'footer.companyAbout': 'વિશે',\n    'footer.companyBlog': 'બ્લોગ',\n    'footer.companyContact': 'સંપર્ક',\n    'footer.legal': 'કાનૂની',\n    'footer.legalPrivacy': 'ગોપનીયતા',\n    'footer.legalTerms': 'શરતો',\n    'footer.cookiePolicy': 'કુકીનો નિયમ',\n    'footer.accessibility': 'શોધક્ષમતा',\n    'footer.encryption': '256-બિટ એનક્રિપટન',\n    'footer.hipaa': 'HIPAA આધીન',\n    'footer.wcag': 'WCAG 2.1 AA સુલભ'\n\2"
    ),
    # Kannada
    (
        r"(kn: \{.*?'testimonials\.subtitle': '[^']*',)\n+(\s*\}),",
        r"\1,\n    'footer.product': 'ಉತ್ಪನ್ನ',\n    'footer.productFeatures': 'ವৈಶಿಷ್ಟ್ಯ',\n    'footer.productHowItWorks': 'ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ',\n    'footer.productTestimonials': 'ಸಾಕ್ಷ್ಯ',\n    'footer.productFAQ': 'FAQ',\n    'footer.company': 'ಕಂಪನಿ',\n    'footer.companyAbout': 'ಕುರಿತು',\n    'footer.companyBlog': 'ಬ್ಲಾಗ್',\n    'footer.companyContact': 'ಸಂಪರ್ಕ',\n    'footer.legal': 'ಕಾನೂನು',\n    'footer.legalPrivacy': 'ಗೌಪ್ಯತೆ',\n    'footer.legalTerms': 'ನಿಯಮ',\n    'footer.cookiePolicy': 'ಕುಕೀ ನೀತಿ',\n    'footer.accessibility': 'ಪ್ರವೇಶನೀಯತೆ',\n    'footer.encryption': '256-ಬಿಟ್ ಎನ್‌ಕ್ರಿಪ್ಶನ್',\n    'footer.hipaa': 'HIPAA ಅನುರೂಪ',\n    'footer.wcag': 'WCAG 2.1 AA ಪ್ರವೇಶಿಸಬಹುದಾದ'\n\2"
    ),
    # Punjabi
    (
        r"(pa: \{.*?'testimonials\.subtitle': '[^']*',)\n+(\s*\}),",
        r"\1,\n    'footer.product': 'ਉਤਪਾਦ',\n    'footer.productFeatures': 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',\n    'footer.productHowItWorks': 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ',\n    'footer.productTestimonials': 'ਸਾਖੀ',\n    'footer.productFAQ': 'FAQ',\n    'footer.company': 'ਕੰਪਨੀ',\n    'footer.companyAbout': 'ਬਾਰੇ',\n    'footer.companyBlog': 'ਬਲੌਗ',\n    'footer.companyContact': 'ਸੰਪਰਕ',\n    'footer.legal': 'ਕਾਨੂੰਨੀ',\n    'footer.legalPrivacy': 'ਨਿਜਤਾ',\n    'footer.legalTerms': 'ਸ਼ਰਤਾਂ',\n    'footer.cookiePolicy': 'ਕੁਕੀ ਨੀਤੀ',\n    'footer.accessibility': 'ਰਸਾਈ',\n    'footer.encryption': '256-ਬਿੱਟ ਏਨਕ੍ਰਿਪਸ਼ਨ',\n    'footer.hipaa': 'HIPAA ਅਨੁਕੂਲ',\n    'footer.wcag': 'WCAG 2.1 AA ਪਹੁੰਚਯੋਗ'\n\2"
    ),
    # Assamese
    (
        r"(as: \{.*?'testimonials\.subtitle': '[^']*',)\n+(\s*\}),",
        r"\1,\n    'footer.product': 'পণ्य',\n    'footer.productFeatures': 'বৈশিষ্ট്য',\n    'footer.productHowItWorks': 'ই কেনেकৈ কাম কৰে',\n    'footer.productTestimonials': 'साक्ष्य',\n    'footer.productFAQ': 'FAQ',\n    'footer.company': 'कोम्पানी',\n    'footer.companyAbout': 'स्पर्के',\n    'footer.companyBlog': 'ব্لاগ',\n    'footer.companyContact': 'संपर्क',\n    'footer.legal': 'आयनी',\n    'footer.legalPrivacy': 'गोपनीयता',\n    'footer.legalTerms': 'पद',\n    'footer.cookiePolicy': 'কুকি नीति',\n    'footer.accessibility': 'সুलভता',\n    'footer.encryption': '256-बиट এনक्रिपশन',\n    'footer.hipaa': 'HIPAA সম্मत',\n    'footer.wcag': 'WCAG 2.1 AA सुलभ'\n\2"
    ),
    # Odiya
    (
        r"(or: \{.*?'testimonials\.subtitle': '[^']*',)\n+(\s*\}),?",
        r"\1,\n    'footer.product': 'ଉତ୍ପାଦ',\n    'footer.productFeatures': 'ବୈଶିଷ୍ଟ୍ୟ',\n    'footer.productHowItWorks': 'ଏହା କିପରି କାର୍ୟ୍ୟ କରେ',\n    'footer.productTestimonials': 'ପ୍ରଶଂସାପତ୍ର',\n    'footer.productFAQ': 'FAQ',\n    'footer.company': 'କମ୍ପାନୀ',\n    'footer.companyAbout': 'ବିଷୟରେ',\n    'footer.companyBlog': 'ବ୍ଲଗ',\n    'footer.companyContact': 'ଯୋଗାଯୋଗ',\n    'footer.legal': 'ଆଇନି',\n    'footer.legalPrivacy': 'ଗୋପନୀୟତା',\n    'footer.legalTerms': 'ସର୍ତ୍ତାବଳୀ',\n    'footer.cookiePolicy': 'କୁକିଜ ନୀତି',\n    'footer.accessibility': 'ସୁଲଭତା',\n    'footer.encryption': '256-ବିଟ ଏନକ୍ରିପଶନ',\n    'footer.hipaa': 'HIPAA ଅନୁରୂପ',\n    'footer.wcag': 'WCAG 2.1 AA ଆକ୍ସେସଯୋଗ୍ୟ'\n\2"
    ),
]

for pattern, replacement in replacements:
    content = re.sub(pattern, replacement, content, flags=re.DOTALL, count=1)

with open('lib/i18n/translations.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed GU, KN, PA, AS, OR")
