#!/usr/bin/env python3
"""P6 — compare before/after doctor-card baselines.

1. Text equality: Himanshu / Shalabh / Akshay innerText must be byte-identical;
   Shruti's must equal the OLD text with exactly the new credential content.
2. Pixel equality: for the three unchanged cards, crop each before/after
   screenshot to the card's top-anchored CONTENT region (card top -> just
   above the CTA, which is bottom-anchored via mt-auto) and diff.
"""
import json
from PIL import Image, ImageChops
import numpy as np

before = json.load(open("/tmp/p6-cards-before.json"))
after = json.load(open("/tmp/p6-cards-after.json"))
QA = "/home/z/my-project/download/qa"

names = [c["name"] for c in before]
print("card order:", names)
assert names == [c["name"] for c in after], "card order changed!"

# ---- 1. text comparison -------------------------------------------------
print("\n=== TEXT ===")
for b, a in zip(before, after):
    same = b["text"] == a["text"]
    print(f"[{b['i']}] {b['name']}: innerText {'IDENTICAL' if same else 'CHANGED'}")
    if not same and b["name"] == "Dr. Shruti Beri Arora":
        old_lines = b["text"].splitlines()
        new_lines = a["text"].splitlines()
        print("  BEFORE:", json.dumps(old_lines, ensure_ascii=False))
        print("  AFTER: ", json.dumps(new_lines, ensure_ascii=False))
    elif not same:
        print("  !! UNEXPECTED CHANGE in unchanged card")
        print("  before:", json.dumps(b["text"], ensure_ascii=False))
        print("  after: ", json.dumps(a["text"], ensure_ascii=False))

# Shruti's expected exact new card text (innerText order, blank lines collapsed)
shruti_after = after[1]["text"]
required = [
    "Dr. Shruti Beri Arora",
    "Consultant Dental Surgeon & Periodontist",   # rendered uppercase via CSS, innerText keeps case? check both
    "B.D.S. — Manipal",
    "M.D.S. — Government Dental College, Chennai",
    "Guru Teg Bahadur Hospital, Dehradun",
    "Apollo Speciality Hospital, Trichy, Tamil Nadu",
    "Noble Medical & Dental College, Nepal",
]
print("\n=== SHRUTI REQUIRED LINES ===")
for r in required:
    hit = r in shruti_after or r.upper() in shruti_after.upper()
    print(f"  {'OK ' if hit else 'MISSING'} {r}")
forbidden_extra = ["BDS, MDS"]  # old compact string must be gone
print("  old 'BDS, MDS' present:", "BDS, MDS" in shruti_after)

# ---- 2. pixel comparison (unchanged cards, content region) --------------
print("\n=== PIXELS (content region: card top -> CTA top) ===")
for i in (0, 2, 3):
    b, a = before[i], after[i]
    img_b = Image.open(f"{QA}/p6-before-card{i}-1280.png").convert("RGB")
    img_a = Image.open(f"{QA}/p6-after-card{i}-1280.png").convert("RGB")
    # content region in viewport coords: y = 80 .. ctaTop - 6, x = card x .. x+w
    y0, x0 = 80, int(b["rect"]["x"])
    y1_b = int(b["ctaTop"]) - 6
    y1_a = int(a["ctaTop"]) - 6
    y1 = min(y1_b, y1_a)          # common comparable height
    w = int(min(b["rect"]["w"], a["rect"]["w"]))
    crop_b = img_b.crop((x0, y0, x0 + w, y1))
    crop_a = img_a.crop((x0, y0, x0 + w, y1))
    diff = ImageChops.difference(crop_b, crop_a)
    arr = np.asarray(diff).sum(axis=2)
    strong = int((arr > 30).sum())
    print(f"[{i}] {b['name']}: region {w}x{y1-y0}  strong-diff pixels(>30) = {strong}")
