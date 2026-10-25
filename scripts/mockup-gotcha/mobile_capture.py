# GOTCHA 휴대폰(390x844) 버전: 사진(2배율) + 흐름 영상 3개. 게스트(비로그인), 제보는 등록 직전까지.
import asyncio, sys
sys.stdout.reconfigure(encoding="utf-8")
from playwright.async_api import async_playwright
HIDE = "*::-webkit-scrollbar{display:none!important}*{scrollbar-width:none!important}"
SHEET = """()=>{const d=document.querySelector('div.absolute.bottom-0.z-40');return d?Math.round(d.getBoundingClientRect().top):null}"""
SHOTS = False
async def shot(pg, n):
    if SHOTS: await pg.screenshot(path=f"mshots/{n}.png")
async def touch_drag(pg, x0, y0, x1, y1, steps=30, gap=16):
    cdp = await pg.context.new_cdp_session(pg)
    await cdp.send("Input.dispatchTouchEvent", {"type":"touchStart","touchPoints":[{"x":x0,"y":y0}]})
    for i in range(1, steps+1):
        await cdp.send("Input.dispatchTouchEvent", {"type":"touchMove","touchPoints":[{"x":x0+(x1-x0)*i/steps,"y":y0+(y1-y0)*i/steps}]})
        await pg.wait_for_timeout(gap)
    await cdp.send("Input.dispatchTouchEvent", {"type":"touchEnd","touchPoints":[]})
async def tap(pg, loc):
    await loc.click()
async def start(pg, on_loaded=None):
    await pg.goto("https://www.gotcha.it.com/login", wait_until="networkidle"); await pg.add_style_tag(content=HIDE)
    if on_loaded: await on_loaded()
    await pg.wait_for_timeout(2500); await shot(pg, "01-first")
    await tap(pg, pg.get_by_text("게스트로 둘러보기")); await pg.wait_for_timeout(1200)
    await tap(pg, pg.get_by_text("(필수) 이용약관 동의")); await pg.wait_for_timeout(800)
    await tap(pg, pg.get_by_text("동의하고 계속하기")); await pg.wait_for_timeout(4500); await pg.add_style_tag(content=HIDE)
async def find_flow(pg):
    await shot(pg, "02-home")
    await tap(pg, pg.get_by_text("위치로 업체 검색").first); await pg.wait_for_timeout(900)
    await pg.keyboard.type("신림역", delay=220); await pg.wait_for_timeout(1500); await shot(pg, "03-search")
    await tap(pg, pg.get_by_text("2호선").first); await pg.wait_for_timeout(3500); await shot(pg, "04-search-result")
    it = pg.get_by_text("가차양신림").first; await it.scroll_into_view_if_needed(); await pg.wait_for_timeout(1200)
    await tap(pg, it); await pg.wait_for_timeout(3000); await shot(pg, "05-preview")
    await tap(pg, pg.get_by_text("가차양신림").first); await pg.wait_for_timeout(3000); await pg.add_style_tag(content=HIDE); await shot(pg, "06-detail")
    await touch_drag(pg, 195, 600, 195, 470); await pg.wait_for_timeout(2500)
async def map_flow(pg):
    await pg.wait_for_timeout(1500)
    await touch_drag(pg, 160, 260, 220, 320); await pg.wait_for_timeout(1500)
    await tap(pg, pg.get_by_text("이 지역 재검색").first); await pg.wait_for_timeout(2500)
    await tap(pg, pg.get_by_text("가차양신림").first); await pg.wait_for_timeout(2200)
    t = await pg.evaluate(SHEET); print(" preview", t)
    await touch_drag(pg, 195, t+12, 195, 120); await pg.wait_for_timeout(2200); t = await pg.evaluate(SHEET); print(" up", t)
    await touch_drag(pg, 195, t+12, 195, 480, steps=70, gap=25); await pg.wait_for_timeout(2000); t = await pg.evaluate(SHEET); print(" down", t)
    for _ in range(2):
        if t is not None and t > 600:
            await touch_drag(pg, 195, t+12, 195, 470, steps=70, gap=25); await pg.wait_for_timeout(1800); t = await pg.evaluate(SHEET); print(" again", t)
    await tap(pg, pg.get_by_text("가차양신림").first); await pg.wait_for_timeout(2500); await pg.add_style_tag(content=HIDE)
    await pg.touchscreen.tap(24, 24); await pg.wait_for_timeout(3000); print(" back", pg.url)
async def report_flow(pg):
    await tap(pg, pg.get_by_role("button", name="제보하기")); await pg.wait_for_timeout(3000); await pg.add_style_tag(content=HIDE)
    await touch_drag(pg, 195, 380, 140, 320); await pg.wait_for_timeout(2500); await shot(pg, "07-report-map")
    await tap(pg, pg.get_by_text("이 주소로 등록할래요")); await pg.wait_for_timeout(2500)
    dup = pg.get_by_text("중복되는 장소가 없어요")
    if await dup.count():
        await shot(pg, "07b-duplicate"); await pg.wait_for_timeout(1500)
        await tap(pg, dup.first)
    await pg.wait_for_url("**/report/register**", timeout=15000); await pg.wait_for_timeout(2000); await pg.add_style_tag(content=HIDE); await pg.add_style_tag(content=HIDE)
    await tap(pg, pg.get_by_placeholder("매장명을 2자 이상 작성해주세요")); await pg.keyboard.type("강남 가챠 플레이스", delay=160); await pg.wait_for_timeout(600)
    await tap(pg, pg.get_by_placeholder("예시) 지하 1층 베스킨라빈스 맞은편")); await pg.keyboard.type("2층, 편의점 옆 계단", delay=140); await pg.wait_for_timeout(600)
    await tap(pg, pg.get_by_text("매일").first); await pg.wait_for_timeout(1800); await shot(pg, "08-report-form")
    await touch_drag(pg, 195, 600, 195, 400); await pg.wait_for_timeout(2000)
    # 등록하기는 누르지 않음
async def run(p, flow, video):
    global SHOTS
    SHOTS = not video
    import os, shutil, time
    b = await p.chromium.launch(channel="chrome", headless=True)
    o = dict(viewport={"width":390,"height":844}, device_scale_factor=2, is_mobile=True, has_touch=True, locale="ko-KR",
             geolocation={"latitude":37.4842 if flow=="map" else 37.4979,"longitude":126.9297 if flow=="map" else 127.0276}, permissions=["geolocation"])
    ctx = await b.new_context(**o); await ctx.add_init_script(path="blur_init.js"); pg = await ctx.new_page()
    frames = []; fdir = f"frames_{flow}"; state = {"on": False, "task": None}
    async def recorder():
        while state["on"]:
            try:
                buf = await pg.screenshot(type="jpeg", quality=90, scale="device")
            except Exception:
                await asyncio.sleep(0.05); continue
            i = len(frames); open(f"{fdir}/{i:05d}.jpg", "wb").write(buf); frames.append(time.perf_counter())
    async def rec_on():
        shutil.rmtree(fdir, ignore_errors=True); os.makedirs(fdir)
        state["on"] = True; state["task"] = asyncio.ensure_future(recorder())
    if video:
        await start(pg, on_loaded=rec_on if flow == "find" else None)
        if flow != "find": await rec_on()
    else:
        await start(pg)
    await {"find":find_flow,"map":map_flow,"report":report_flow}[flow](pg)
    if video:
        await pg.wait_for_timeout(500); state["on"] = False; await state["task"]
        with open(f"{fdir}/list.txt", "w") as f:
            for i, t in enumerate(frames):
                d = (frames[i+1] - t) if i + 1 < len(frames) else 0.5
                f.write("file '%05d.jpg'" % i + chr(10) + "duration %.4f" % max(d, 0.01) + chr(10))
            f.write("file '%05d.jpg'" % (len(frames)-1) + chr(10))
        dur = frames[-1] - frames[0] if len(frames) > 1 else 0
        print(flow, "video", len(frames), "frames", round(dur, 1), "s", round(len(frames)/dur, 1) if dur else 0, "fps", flush=True)
    else:
        print(flow, "shots", flush=True)
    await ctx.close(); await b.close()

async def main():
    async with async_playwright() as p:
        for f in sys.argv[1:]:
            name, v = f.split(":"); await run(p, name, v == "v")
if __name__ == "__main__": asyncio.run(main())
