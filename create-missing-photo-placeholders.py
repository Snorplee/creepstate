#!/usr/bin/env python3
"""
Create placeholder images for people without photos
This creates simple, professional placeholder images for missing people
"""

import os
import sys
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json

def create_placeholder_image(person_id, category, name, flag, color_hex, output_path):
    """Create a professional placeholder image"""
    try:
        # Convert hex color to RGB
        color = tuple(int(color_hex[i:i+2], 16) for i in (1, 3, 5))
        
        # Image dimensions
        size = (400, 400)
        
        # Create image with solid color background
        img = Image.new('RGB', size, color)
        draw = ImageDraw.Draw(img)
        
        # Add darker border
        border_color = tuple(max(0, c-50) for c in color)
        draw.rectangle([0, 0, size[0]-1, size[1]-1], outline=border_color, width=8)
        
        # Add circular center with lighter color
        center = (size[0]//2, size[1]//2)
        radius = 120
        light_color = tuple(min(255, c+30) for c in color)
        
        # Draw circle
        draw.ellipse([center[0]-radius, center[1]-radius, 
                     center[0]+radius, center[1]+radius], 
                     fill=light_color, outline=border_color, width=4)
        
        # Try to add flag emoji (this might not render properly on all systems)
        try:
            # For simplicity, we'll add the first letter of the name instead
            initial = name[0].upper()
            
            # Try to load a font
            try:
                font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 80)
            except:
                try:
                    font = ImageFont.truetype("arial.ttf", 80)
                except:
                    font = ImageFont.load_default()
            
            # Draw the initial
            text_bbox = draw.textbbox((0, 0), initial, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            
            text_x = center[0] - text_width // 2
            text_y = center[1] - text_height // 2
            
            # Add text shadow
            shadow_color = tuple(max(0, c-100) for c in color)
            draw.text((text_x+2, text_y+2), initial, font=font, fill=shadow_color)
            draw.text((text_x, text_y), initial, font=font, fill='white')
            
        except Exception as e:
            print(f"Could not add text to placeholder for {name}: {e}")
        
        # Ensure directory exists
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Save image
        img.save(output_path, 'JPEG', quality=90)
        print(f"Created placeholder for {name}: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error creating placeholder for {name}: {e}")
        return False

def main():
    """Create placeholders for missing people"""
    base_path = Path("/mnt/c/Users/Snorplee/Documents/Dropbox/apps/trumpstein-timeline")
    people_path = base_path / "images" / "people"
    
    # Define missing people who need placeholders
    missing_people = [
        # Politicians
        {"id": "matt-gaetz", "category": "politicians", "name": "Matt Gaetz", "flag": "🇺🇸", "color": "#FF4500"},
        {"id": "alex-acosta", "category": "politicians", "name": "Alex Acosta", "flag": "⚖️", "color": "#FF4500"},
        
        # Business
        {"id": "les-wexner", "category": "business", "name": "Les Wexner", "flag": "💰", "color": "#4ECDC4"},
        {"id": "glenn-dubin", "category": "business", "name": "Glenn Dubin", "flag": "🏦", "color": "#4ECDC4"},
        {"id": "leon-black", "category": "business", "name": "Leon Black", "flag": "🏛️", "color": "#4ECDC4"},
        {"id": "kimbal-musk", "category": "business", "name": "Kimbal Musk", "flag": "🍽️", "color": "#4ECDC4"},
        
        # Academics
        {"id": "marvin-minsky", "category": "academics", "name": "Marvin Minsky", "flag": "🎭", "color": "#45B7D1"},
        
        # Celebrities
        {"id": "kevin-spacey", "category": "celebrities", "name": "Kevin Spacey", "flag": "🎬", "color": "#FF69B4"},
        {"id": "chris-tucker", "category": "celebrities", "name": "Chris Tucker", "flag": "🎵", "color": "#FF69B4"},
        {"id": "michael-wolff", "category": "celebrities", "name": "Michael Wolff", "flag": "📚", "color": "#FF69B4"},
        
        # Enablers
        {"id": "jean-luc-brunel", "category": "enablers", "name": "Jean-Luc Brunel", "flag": "🍷", "color": "#8B0000"},
        {"id": "sarah-kellen", "category": "enablers", "name": "Sarah Kellen", "flag": "🏠", "color": "#8B0000"}
    ]
    
    created_count = 0
    
    for person in missing_people:
        # Check if file already exists
        output_path = people_path / person["category"] / f"{person['id']}.jpg"
        
        if not output_path.exists():
            success = create_placeholder_image(
                person["id"],
                person["category"],
                person["name"],
                person["flag"],
                person["color"],
                output_path
            )
            if success:
                created_count += 1
        else:
            print(f"Photo already exists for {person['name']}: {output_path}")
    
    print(f"\nCreated {created_count} placeholder images")
    print("Placeholders created for people without available photos")

if __name__ == "__main__":
    main()