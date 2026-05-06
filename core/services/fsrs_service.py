from datetime import datetime, timezone
from fsrs import Scheduler, Card as FSRSCard, Rating, State


def get_scheduler():
    return Scheduler(
        desired_retention=0.9,
        enable_fuzzing=True
    )


def card_review_to_fsrs_card(card_review):
    if card_review is None:
        return FSRSCard()

    if not card_review.last_review:
        return FSRSCard()

    fsrs_card = FSRSCard()
    fsrs_card.due = card_review.due if card_review.due else datetime.now(timezone.utc)
    fsrs_card.stability = card_review.stability
    fsrs_card.difficulty = card_review.difficulty
    fsrs_card.last_review = card_review.last_review

    if card_review.step is not None:
        fsrs_card.step = card_review.step
    else:
        fsrs_card.step = None

    try:
        fsrs_card.state = State(card_review.state)
    except ValueError:
        fsrs_card.state = State.Learning

    return fsrs_card


def review_card(card_review, rating_int):
    scheduler = get_scheduler()
    fsrs_card = card_review_to_fsrs_card(card_review)

    rating_map = {1: Rating.Again, 2: Rating.Hard, 3: Rating.Good, 4: Rating.Easy}
    rating = rating_map.get(rating_int, Rating.Good)

    new_card, review_log = scheduler.review_card(fsrs_card, rating)

    now = datetime.now(timezone.utc)
    scheduled_days = max(0, (new_card.due - now).days)

    updated_fields = {
        'due': new_card.due,
        'stability': new_card.stability,
        'difficulty': new_card.difficulty,
        'state': new_card.state.value if hasattr(new_card.state, 'value') else int(new_card.state),
        'step': new_card.step,
        'scheduled_days': scheduled_days,
        'last_review': now,
    }

    log_data = {
        'rating': rating.value,
        'state': new_card.state.value if hasattr(new_card.state, 'value') else int(new_card.state),
        'elapsed_days': 0,
    }

    return updated_fields, log_data

def get_preview_intervals(card_review, scheduler=None):
    if scheduler is None:
        scheduler = get_scheduler()
    fsrs_card = card_review_to_fsrs_card(card_review)
    now = datetime.now(timezone.utc)

    previews = {}
    for rating in [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]:
        new_card, _ = scheduler.review_card(fsrs_card, rating)
        delta = new_card.due - now
        total_minutes = delta.total_seconds() / 60
        previews[rating.value] = total_minutes
    return previews

def format_interval(minutes):
    if minutes < 1:
        return "<1m"
    elif minutes < 60:
        return f"{int(minutes)}m"
    elif minutes < 1440:
        hours = round(minutes / 60)
        return f"{hours}h"
    else:
        days = minutes / 1440
        if days < 30:
            return f"{int(round(days))}d"
        elif days < 365:
            months = round(days / 30.0, 1)
            return f"{months}mo"
        else:
            years = round(days / 365.0, 1)
            return f"{years}y"
