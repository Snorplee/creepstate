#!/usr/bin/env python3
"""
Missing Photos Analysis for Trump-Epstein Investigation
Identifies key figures who need photos downloaded
"""

import json
from pathlib import Path

def analyze_missing_photos():
    """Analyze which key investigation figures are missing photos"""
    
    # Define comprehensive list of key investigation figures
    key_figures = {
        'core': [
            'Jeffrey Epstein',
            'Ghislaine Maxwell',
            'Donald Trump',
            'Bill Clinton'
        ],
        'enablers': [
            'Jeffrey Epstein',
            'Ghislaine Maxwell',
            'Jean-Luc Brunel',
            'Lex Wexner',
            'Igor Zinoviev',
            'Sarah Kellen',
            'Nadia Marcinkova'
        ],
        'politicians': [
            'Donald Trump',
            'Bill Clinton',
            'Hillary Clinton',
            'Alan Dershowitz',
            'George Mitchell',
            'Bill Richardson',
            'Ehud Barak',
            'Tony Blair'
        ],
        'business': [
            'Bill Gates',
            'Lex Wexner',
            'Leon Black',
            'Glenn Dubin',
            'Thomas Pritzker',
            'Marvin Minsky',
            'Reid Hoffman',
            'Elon Musk'
        ],
        'celebrities': [
            'Kevin Spacey',
            'Woody Allen',
            'Chris Tucker',
            'Naomi Campbell',
            'Courtney Love',
            'Ralph Fiennes',
            'Alec Baldwin',
            'David Copperfield'
        ],
        'academics': [
            'Stephen Hawking',
            'Lawrence Krauss',
            'Martin Nowak',
            'George Church',
            'Steven Pinker',
            'Marvin Minsky'
        ],
        'royalty': [
            'Prince Andrew',
            'Sarah Ferguson',
            'Princess Beatrice',
            'Princess Eugenie'
        ],
        'victims': [
            'Virginia Giuffre',
            'Maria Farmer',
            'Annie Farmer',
            'Courtney Wild',
            'Michelle Licata',
            'Sarah Ransome'
        ],
        'media': [
            'Katie Couric',
            'George Stephanopoulos',
            'Charlie Rose',
            'Mort Zuckerman',
            'Rupert Murdoch'
        ],
        'international': [
            'Jean-Luc Brunel',
            'Mohammed bin Salman',
            'Vladimir Putin',
            'Sergey Brin',
            'Peter Thiel'
        ],
        'intelligence': [
            'Robert Maxwell',
            'Barak Ehud',
            'Alexander Acosta',
            'William Barr'
        ],
        'legal': [
            'Alan Dershowitz',
            'Kenneth Starr',
            'Alexander Acosta',
            'William Barr',
            'David Boies'
        ],
        'russian': [
            'Vladimir Putin',
            'Sergey Brin',
            'Igor Zinoviev',
            'Dmitri Klokov'
        ]
    }
    
    # Check existing photos
    images_dir = Path('images/people')
    missing_analysis = {}
    
    for category, people in key_figures.items():
        category_dir = images_dir / category
        missing_analysis[category] = {
            'missing_people': [],
            'has_photos': [],
            'needs_more_photos': []
        }
        
        for person in people:
            base_name = person.lower().replace(' ', '-')
            
            # Check if any photos exist for this person
            person_photos = []
            if category_dir.exists():
                person_photos = list(category_dir.glob(f"{base_name}*.jpg")) + \
                               list(category_dir.glob(f"{base_name}*.png")) + \
                               list(category_dir.glob(f"{base_name}*.webp"))
            
            if not person_photos:
                missing_analysis[category]['missing_people'].append(person)
            elif len(person_photos) < 3:  # Less than 3 photos
                missing_analysis[category]['needs_more_photos'].append({
                    'name': person,
                    'count': len(person_photos)
                })
            else:
                missing_analysis[category]['has_photos'].append({
                    'name': person,
                    'count': len(person_photos)
                })
    
    return missing_analysis

def generate_priority_download_list(missing_analysis):
    """Generate prioritized list of people who need photos"""
    
    # Priority levels based on investigation importance
    priority_mapping = {
        'core': 1,           # Highest priority
        'enablers': 1,       # Highest priority  
        'politicians': 2,    # High priority
        'victims': 2,        # High priority
        'business': 3,       # Medium priority
        'royalty': 3,        # Medium priority
        'legal': 4,          # Lower priority
        'celebrities': 5,    # Lower priority
        'academics': 5,      # Lower priority
        'media': 6,          # Lowest priority
        'international': 6,  # Lowest priority
        'intelligence': 4,   # Lower priority
        'russian': 4         # Lower priority
    }
    
    priority_list = []
    
    for category, analysis in missing_analysis.items():
        priority = priority_mapping.get(category, 5)
        
        # Add completely missing people
        for person in analysis['missing_people']:
            priority_list.append({
                'name': person,
                'category': category,
                'priority': priority,
                'status': 'missing',
                'current_photos': 0
            })
        
        # Add people who need more photos
        for person_data in analysis['needs_more_photos']:
            priority_list.append({
                'name': person_data['name'],
                'category': category,
                'priority': priority + 1,  # Slightly lower priority
                'status': 'needs_more',
                'current_photos': person_data['count']
            })
    
    # Sort by priority, then by name
    priority_list.sort(key=lambda x: (x['priority'], x['name']))
    
    return priority_list

def main():
    """Generate missing photos analysis report"""
    print("📋 Missing Photos Analysis - Trump-Epstein Investigation")
    print("=" * 70)
    
    # Analyze missing photos
    missing_analysis = analyze_missing_photos()
    
    # Generate priority list
    priority_list = generate_priority_download_list(missing_analysis)
    
    # Summary statistics
    total_missing = sum(len(cat['missing_people']) for cat in missing_analysis.values())
    total_needs_more = sum(len(cat['needs_more_photos']) for cat in missing_analysis.values())
    total_has_photos = sum(len(cat['has_photos']) for cat in missing_analysis.values())
    
    print(f"📊 SUMMARY:")
    print(f"  People with photos: {total_has_photos}")
    print(f"  People missing photos: {total_missing}")
    print(f"  People needing more photos: {total_needs_more}")
    print(f"  Total needing attention: {total_missing + total_needs_more}")
    print()
    
    # Priority download list
    print("🎯 PRIORITY DOWNLOAD LIST:")
    print("Priority 1 (Critical - Core figures)")
    print("Priority 2 (High - Politicians/Victims)")  
    print("Priority 3 (Medium - Business/Royalty)")
    print("Priority 4+ (Lower - Others)")
    print()
    
    current_priority = 0
    for item in priority_list:
        if item['priority'] != current_priority:
            current_priority = item['priority']
            priority_name = {
                1: "CRITICAL", 2: "HIGH", 3: "MEDIUM", 
                4: "LOWER", 5: "LOW", 6: "LOWEST"
            }.get(current_priority, "OTHER")
            print(f"\n🔴 PRIORITY {current_priority} ({priority_name}):")
        
        status_icon = "❌" if item['status'] == 'missing' else "⚠️"
        print(f"  {status_icon} {item['name']} ({item['category']}) - {item['current_photos']} photos")
    
    # Category breakdown
    print(f"\n📁 CATEGORY BREAKDOWN:")
    for category, analysis in missing_analysis.items():
        missing_count = len(analysis['missing_people'])
        needs_more_count = len(analysis['needs_more_photos'])
        has_photos_count = len(analysis['has_photos'])
        
        if missing_count > 0 or needs_more_count > 0:
            print(f"  {category}:")
            print(f"    ❌ Missing: {missing_count}")
            print(f"    ⚠️  Needs more: {needs_more_count}")
            print(f"    ✅ Has photos: {has_photos_count}")
    
    # Save analysis to JSON
    output_data = {
        'timestamp': '2025-08-20 22:30:00',
        'summary': {
            'total_missing': total_missing,
            'total_needs_more': total_needs_more,
            'total_has_photos': total_has_photos
        },
        'priority_list': priority_list,
        'category_analysis': missing_analysis
    }
    
    with open('missing-photos-analysis.json', 'w') as f:
        json.dump(output_data, f, indent=2)
    
    print(f"\n📄 Analysis saved to missing-photos-analysis.json")
    
    return output_data

if __name__ == "__main__":
    main()