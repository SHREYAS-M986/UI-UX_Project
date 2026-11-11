import csv
import math
from PIL import Image
import os

def srgb_to_linear(val):
    v = val / 255.0
    if v <= 0.04045:
        return v / 12.92
    else:
        return math.pow((v + 0.055) / 1.055, 2.4)

def relative_luminance(r, g, b):
    R = srgb_to_linear(r)
    G = srgb_to_linear(g)
    B = srgb_to_linear(b)
    return 0.2126 * R + 0.7152 * G + 0.0722 * B

def contrast_ratio(rgb1, rgb2):
    L1 = relative_luminance(rgb1[0], rgb1[1], rgb1[2])
    L2 = relative_luminance(rgb2[0], rgb2[1], rgb2[2])
    lighter = max(L1, L2)
    darker = min(L1, L2)
    return (lighter + 0.05) / (darker + 0.05)

def hex_to_rgb(hex_str):
    hex_clean = hex_str.strip().lstrip('#')
    return tuple(int(hex_clean[i:i+2], 16) for i in (0, 2, 4))

# Key palette tokens
PALETTE = {
    'Forest Black': '#15231C',
    'Deep Green': '#21402A',
    'Mist White': '#ECECE4',
    'Amber Brown': '#8B6222',
    'Taupe': '#A08569',
    'Background Sage Base': '#D9DFD5',
}

def analyze_contrast():
    print('Calculating WCAG 2.1/2.2 Relative Luminance and Contrast Ratios...')
    
    # 1. Theoretical Token Combinations
    pairs = [
        ('Forest Black', '#15231C', 'Mist White', '#ECECE4', 'Primary text on Mist card surfaces'),
        ('Deep Green', '#21402A', 'Mist White', '#ECECE4', 'Deep Green headings/accents on Mist'),
        ('Amber Brown', '#8B6222', 'Mist White', '#ECECE4', 'Critical status indicator text on Mist'),
        ('Taupe', '#A08569', 'Mist White', '#ECECE4', 'Serious status indicator text on Mist'),
        ('Forest Black', '#15231C', 'Taupe', '#A08569', 'Forest Black text on Taupe badge container'),
        ('Forest Black', '#15231C', 'Amber Brown', '#8B6222', 'Forest Black text on Amber container'),
        ('Mist White', '#ECECE4', 'Forest Black', '#15231C', 'Mist White text on Forest Black sidebar/button'),
        ('Mist White', '#ECECE4', 'Deep Green', '#21402A', 'Mist White text on Deep Green progress bar'),
        ('Forest Black', '#15231C', 'Background Sage Base', '#D9DFD5', 'Primary text directly on outer canvas'),
    ]

    results = []
    for fg_name, fg_hex, bg_name, bg_hex, context in pairs:
        fg_rgb = hex_to_rgb(fg_hex)
        bg_rgb = hex_to_rgb(bg_hex)
        cr = contrast_ratio(fg_rgb, bg_rgb)
        pass_normal_aa = cr >= 4.5
        pass_large_aa = cr >= 3.0
        pass_aaa = cr >= 7.0
        
        status = 'Pass AAA' if pass_aaa else ('Pass AA' if pass_normal_aa else ('Pass AA Large' if pass_large_aa else 'Fail'))
        results.append({
            'Category': 'Design Token Pair',
            'Foreground': f'{fg_name} ({fg_hex})',
            'Background': f'{bg_name} ({bg_hex})',
            'Context': context,
            'Ratio': round(cr, 2),
            'Ratio_Text': f'{round(cr, 2)}:1',
            'WCAG_AA_Normal (4.5:1)': 'Pass' if pass_normal_aa else 'Fail',
            'WCAG_AA_Large (3.0:1)': 'Pass' if pass_large_aa else 'Fail',
            'WCAG_AAA (7.0:1)': 'Pass' if pass_aaa else 'Fail',
            'Status': status
        })

    # 2. Pixel Sampling from Rendered Screenshots over Glass Panels (Worst-Case Analysis)
    screenshot_path = 'evidence/screenshots/overview-1280px.png'
    if os.path.exists(screenshot_path):
        im = Image.open(screenshot_path).convert('RGB')
        w, h = im.size
        # Sample pixels inside the Fix These First glass card area:
        # e.g., coordinate box around (300, 350) to (800, 600)
        card_pixels = []
        for x in range(350, 750, 20):
            for y in range(400, 700, 20):
                card_pixels.append(im.getpixel((x, y)))
        
        # Calculate luminance for all sampled glass background pixels
        luminances = [relative_luminance(*px) for px in card_pixels]
        min_lum_idx = luminances.index(min(luminances))
        max_lum_idx = luminances.index(max(luminances))
        darkest_bg = card_pixels[min_lum_idx]
        lightest_bg = card_pixels[max_lum_idx]

        fg_forest = hex_to_rgb(PALETTE['Forest Black'])
        
        # Worst case for dark text (Forest Black) is when background is DARKEST
        cr_darkest = contrast_ratio(fg_forest, darkest_bg)
        # Best case for dark text is when background is LIGHTEST
        cr_lightest = contrast_ratio(fg_forest, lightest_bg)

        results.append({
            'Category': 'Rendered Glass Sample (Worst-Case)',
            'Foreground': f'Forest Black Text ({PALETTE["Forest Black"]})',
            'Background': f'Darkest Glass Pixel {darkest_bg}',
            'Context': 'Body text rendered over blurred glass canvas (Worst Case)',
            'Ratio': round(cr_darkest, 2),
            'Ratio_Text': f'{round(cr_darkest, 2)}:1',
            'WCAG_AA_Normal (4.5:1)': 'Pass' if cr_darkest >= 4.5 else 'Fail',
            'WCAG_AA_Large (3.0:1)': 'Pass' if cr_darkest >= 3.0 else 'Fail',
            'WCAG_AAA (7.0:1)': 'Pass' if cr_darkest >= 7.0 else 'Fail',
            'Status': 'Pass AAA' if cr_darkest >= 7.0 else ('Pass AA' if cr_darkest >= 4.5 else 'Fail')
        })

        results.append({
            'Category': 'Rendered Glass Sample (Best-Case)',
            'Foreground': f'Forest Black Text ({PALETTE["Forest Black"]})',
            'Background': f'Lightest Glass Pixel {lightest_bg}',
            'Context': 'Body text rendered over blurred glass canvas (Best Case)',
            'Ratio': round(cr_lightest, 2),
            'Ratio_Text': f'{round(cr_lightest, 2)}:1',
            'WCAG_AA_Normal (4.5:1)': 'Pass' if cr_lightest >= 4.5 else 'Fail',
            'WCAG_AA_Large (3.0:1)': 'Pass' if cr_lightest >= 3.0 else 'Fail',
            'WCAG_AAA (7.0:1)': 'Pass' if cr_lightest >= 7.0 else 'Fail',
            'Status': 'Pass AAA' if cr_lightest >= 7.0 else ('Pass AA' if cr_lightest >= 4.5 else 'Fail')
        })

    # Save to evidence/contrast_results.csv
    csv_path = 'evidence/contrast_results.csv'
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=list(results[0].keys()))
        writer.writeheader()
        writer.writerows(results)

    print(f'Successfully wrote {len(results)} contrast evaluation records to {csv_path}')
    for r in results:
        print(f"[{r['Status']}] {r['Foreground']} on {r['Background']}: {r['Ratio_Text']} ({r['Context']})")

if __name__ == '__main__':
    analyze_contrast()

